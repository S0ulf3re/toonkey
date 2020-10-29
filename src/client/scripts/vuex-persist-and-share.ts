import { MutationPayload, Store } from 'vuex';
// SafariがBroadcastChannel未実装なのでライブラリを使う
import { BroadcastChannel } from 'broadcast-channel';
import { VuexPersistDB, VuexPersistStore } from './vuex-idb';

const states = ['i'];
const modules =  ['device', 'deviceUser', 'settings', 'instance'];

/**
 * Vuexのstate永続化を行い、moduleのcommitをタブ間で共有します
 * @param ignoreMutations 共有しないcommit (mutation type)
 */
export function vuexPersistAndSharePlugin(ignoreMutations: string[] = []) {
	const persistDB = new VuexPersistDB();
	const ch = new BroadcastChannel<MutationPayload>('vuexMutationShare', {
		webWorkerSupport: false
	});

	// 互換性のためlocalStorageを検索
	const old = localStorage.getItem('vuex');

	return async (store: Store<any>) => {
		if (old) {
			store.replaceState({
				...store.state,
				...JSON.parse(old)
			});
			localStorage.removeItem('vuex');
		} else {
			await Promise.all(persistDB.stores.map(n => persistDB.entries(n)))
			.then(vals => vals.map(entries => Object.fromEntries(entries)))
			.then(vals => {
				let savedState = {};

				persistDB.stores.map((n, i) => {
					if (n === 'store') savedState = { ...savedState, ...vals[i] };
					else savedState[n] = { ...store.state[n], ...vals[i] };
				});

				store.replaceState({
					...store.state,
					...savedState
				});
			});
		}

		// 別タブから来たmutation/actionのpayloadのオブジェクトを覚えておく
		const passedPayloads: any[] = [];

		// 別タブからのmutationを実行
		ch.addEventListener('message', mutation => {
			passedPayloads.push(mutation.payload);
			store.commit(mutation.type, mutation.payload);
		});

		store.subscribe((mutation, state) => {
			if (passedPayloads.includes(mutation.payload)) {
				// 別タブから来たmutationの場合は処理をしない
				passedPayloads.splice(passedPayloads.indexOf(mutation.payload), 1);
				return;
			}

			if (ignoreMutations.includes(mutation.type)) return;

			const splited = mutation.type.split('/');
			const module = splited[0];

			// 永続化
			if (splited.length === 1) {
				// mutationがルートの場合
				persistDB.bulkSet(states.map(s => [s, state[s]]), 'store');

				modules.map(m => {
					persistDB.bulkSet(Object.entries(state[m]), m as VuexPersistStore);
				});
			} else if (modules.includes(module)) {
				// mutationがモジュールの場合
				persistDB.bulkSet(Object.entries(state[module]), module as VuexPersistStore);
			}

			// ほかのタブにmutationを伝達
			ch.postMessage(mutation);
		});
	};
}
