/**
 * Service Worker
 */
declare var self: ServiceWorkerGlobalScope;

import { get, set } from 'idb-keyval';
import composeNotification from '@/sw/compose-notification';
import { I18n } from '@/scripts/i18n';

//#region Variables
const version = _VERSION_;
const cacheName = `mk-cache-${version}`;
const apiUrl = `${location.origin}/api/`;

let lang: string;
let i18n: I18n<any>;
let pushesPool: any[] = [];
//#endregion

//#region Startup
get('lang').then(async prelang => {
	if (!prelang) return;
	lang = prelang;
	return fetchLocale();
});
//#endregion

//#region Lifecycle: Install
self.addEventListener('install', ev => {
	ev.waitUntil(
		caches.open(cacheName)
			.then(cache => {
				return cache.addAll([
					`/?v=${version}`
				]);
			})
			.then(() => self.skipWaiting())
	);
});
//#endregion

//#region Lifecycle: Activate
self.addEventListener('activate', ev => {
	ev.waitUntil(
		caches.keys()
			.then(cacheNames => Promise.all(
				cacheNames
					.filter((v) => v !== cacheName)
					.map(name => caches.delete(name))
			))
			.then(() => self.clients.claim())
	);
});
//#endregion

//#region When: Fetching
self.addEventListener('fetch', ev => {
	if (ev.request.method !== 'GET' || ev.request.url.startsWith(apiUrl)) return;
	ev.respondWith(
		caches.match(ev.request)
			.then(response => {
				return response || fetch(ev.request);
			})
			.catch(() => {
				return caches.match(`/?v=${version}`);
			})
	);
});
//#endregion

//#region When: Caught Notification
self.addEventListener('push', ev => {
	// クライアント取得
	ev.waitUntil(self.clients.matchAll({
		includeUncontrolled: true
	}).then(async clients => {
		// クライアントがあったらストリームに接続しているということなので通知しない
		if (clients.length != 0) return;

		const { type, body } = ev.data?.json();

		// localeを読み込めておらずi18nがundefinedだった場合はpushesPoolにためておく
		if (!i18n) return pushesPool.push({ type, body });

		const n = await composeNotification(type, body, i18n);
		if (n) return self.registration.showNotification(...n);
	}));
});
//#endregion

//#region When: Caught a message from the client
self.addEventListener('message', ev => {
	switch(ev.data) {
		case 'clear':
			return; // TODO
		default:
			break;
	}

	if (typeof ev.data === 'object') {
		const otype = Object.prototype.toString.call(ev.data).slice(8, -1).toLowerCase();

		if (otype === 'object') {
			if (ev.data.msg === 'initialize') {
				lang = ev.data.lang;
				set('lang', lang);
				fetchLocale();
			}
		}
	}
});
//#endregion

//#region Function: (Re)Load i18n instance
async function fetchLocale() {
	i18n = new I18n(await (await fetch(`/assets/locales/${lang}.${version}.json`)).json());

	//#region i18nをきちんと読み込んだ後にやりたい処理
	for (const { type, body } of pushesPool) {
		const n = await composeNotification(type, body, i18n);
		if (n) self.registration.showNotification(...n);
	}
	pushesPool = [];
	//#endregion
}
//#endregion
