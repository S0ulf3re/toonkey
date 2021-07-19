import { get, set } from '@client/scripts/idb-proxy';
import { reactive } from 'vue';
import { apiUrl } from '@client/config';
import { waiting } from '@client/os';
import { unisonReload, reloadChannel } from '@client/scripts/unison-reload';

// TODO: 他のタブと永続化されたstateを同期

type Account = {
	id: string;
	token: string;
	isModerator: boolean;
	isAdmin: boolean;
};

const data = localStorage.getItem('account');

// TODO: 外部からはreadonlyに
export const $i = data ? reactive(JSON.parse(data) as Account) : null;

export async function signout() {
	waiting();
	localStorage.removeItem('account');

	//#region Remove account
	const accounts = await getAccounts();
	accounts.splice(accounts.findIndex(x => x.id === $i.id), 1);
	set('accounts', accounts);
	//#endregion

	//#region Remove push notification registration
	await navigator.serviceWorker.ready.then(async r => {
		const push = await r.pushManager.getSubscription();
		if (!push) return;
		return fetch(`${apiUrl}/sw/unregister`, {
			method: 'POST',
			body: JSON.stringify({
				i: $i.token,
				endpoint: push.endpoint,
			}),
		});
	});
	//#endregion

	document.cookie = `igi=; path=/`;

	if (accounts.length > 0) login(accounts[0].token);
	else unisonReload(true);
}

export async function getAccounts(): Promise<{ id: Account['id'], token: Account['token'] }[]> {
	return (await get('accounts')) || [];
}

export async function addAccount(id: Account['id'], token: Account['token']) {
	const accounts = await getAccounts();
	if (!accounts.some(x => x.id === id)) {
		await set('accounts', accounts.concat([{ id, token }]));
	}
}

function fetchAccount(token): Promise<Account> {
	return new Promise((done, fail) => {
		// Fetch user
		fetch(`${apiUrl}/i`, {
			method: 'POST',
			body: JSON.stringify({
				i: token
			})
		})
		.then(res => {
			// When failed to authenticate user
			if (res.status !== 200 && res.status < 500) {
				return signout();
			}

			// Parse response
			res.json().then(i => {
				i.token = token;
				done(i);
			});
		})
		.catch(fail);
	});
}

export function updateAccount(data) {
	for (const [key, value] of Object.entries(data)) {
		$i[key] = value;
	}
	localStorage.setItem('account', JSON.stringify($i));
}

export function refreshAccount() {
	return fetchAccount($i.token).then(updateAccount);
}

export async function login(token: Account['token'], redirect?: string) {
	waiting();
	if (_DEV_) console.log('logging as token ', token);
	const me = await fetchAccount(token);
	localStorage.setItem('account', JSON.stringify(me));
	await addAccount(me.id, token);

	if (redirect) {
		reloadChannel.postMessage('reload');
		location.href = redirect;
		return;
	}

	unisonReload();
}

// このファイルに書きたくないけどここに書かないと何故かVeturが認識しない
declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$i: typeof $i;
	}
}
