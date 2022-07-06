/**
 * BOOT LOADER
 * サーバーからレスポンスされるHTMLに埋め込まれるスクリプトで、以下の役割を持ちます。
 * - 翻訳ファイルをフェッチする。
 * - バージョンに基づいて適切なメインスクリプトを読み込む。
 * - キャッシュされたコンパイル済みテーマを適用する。
 * - クライアントの設定値に基づいて対応するHTMLクラス等を設定する。
 * テーマをこの段階で設定するのは、メインスクリプトが読み込まれる間もテーマを適用したいためです。
 * 注: webpackは介さないため、このファイルではrequireやimportは使えません。
 */

'use strict';

// ブロックの中に入れないと、定義した変数がブラウザのグローバルスコープに登録されてしまい邪魔なので
(async () => {
	window.onerror = (e) => {
		renderError('SOMETHING_HAPPENED', e);
	};
	window.onunhandledrejection = (e) => {
		renderError('SOMETHING_HAPPENED_IN_PROMISE', e);
	};

	const v = localStorage.getItem('v') || VERSION;

	let forceError = localStorage.getItem('forceError');
	if (forceError != null) {
		renderError('FORCED_ERROR', 'This error is forced by having forceError in local storage.')
	}

	//#region Detect language & fetch translations
	const localeVersion = localStorage.getItem('localeVersion');
	const localeOutdated = (localeVersion == null || localeVersion !== v);

	if (!localStorage.hasOwnProperty('locale') || localeOutdated) {
		const supportedLangs = LANGS;
		let lang = localStorage.getItem('lang');
		if (lang == null || !supportedLangs.includes(lang)) {
			if (supportedLangs.includes(navigator.language)) {
				lang = navigator.language;
			} else {
				lang = supportedLangs.find(x => x.split('-')[0] === navigator.language);

				// Fallback
				if (lang == null) lang = 'en-US';
			}
		}

		const res = await fetch(`/assets/locales/${lang}.${v}.json`);
		if (res.status === 200) {
			localStorage.setItem('lang', lang);
			localStorage.setItem('locale', await res.text());
			localStorage.setItem('localeVersion', v);
		} else {
			await checkUpdate();
			renderError('LOCALE_FETCH_FAILED');
			return;
		}
	}
	//#endregion

	//#region Script
	import(`/assets/${CLIENT_ENTRY}`)
		.catch(async e => {
			await checkUpdate();
			renderError('APP_FETCH_FAILED', e);
		})
	//#endregion

	//#region Theme
	const theme = localStorage.getItem('theme');
	if (theme) {
		for (const [k, v] of Object.entries(JSON.parse(theme))) {
			document.documentElement.style.setProperty(`--${k}`, v.toString());

			// HTMLの theme-color 適用
			if (k === 'htmlThemeColor') {
				for (const tag of document.head.children) {
					if (tag.tagName === 'META' && tag.getAttribute('name') === 'theme-color') {
						tag.setAttribute('content', v);
						break;
					}
				}
			}
		}
	}
	//#endregion

	const fontSize = localStorage.getItem('fontSize');
	if (fontSize) {
		document.documentElement.classList.add('f-' + fontSize);
	}

	const useSystemFont = localStorage.getItem('useSystemFont');
	if (useSystemFont) {
		document.documentElement.classList.add('useSystemFont');
	}

	const wallpaper = localStorage.getItem('wallpaper');
	if (wallpaper) {
		document.documentElement.style.backgroundImage = `url(${wallpaper})`;
	}

	const customCss = localStorage.getItem('customCss');
	if (customCss && customCss.length > 0) {
		const style = document.createElement('style');
		style.innerHTML = customCss;
		document.head.appendChild(style);
	}

	// eslint-disable-next-line no-inner-declarations
	function renderError(code, details) {
		let errorsElement = document.getElementById('errors');
		if (!errorsElement) {
			document.getElementsByTagName("head")[0].insertAdjacentHTML(
				"beforeend",
				`<link rel="stylesheet" href="../error.css" />`);
			document.documentElement.innerHTML = `
			<svg class="icon-warning" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-alert-triangle" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   			<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   			<path d="M12 9v2m0 4v.01"></path>
   			<path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75"></path>
			</svg>
			<h1>An error has occurred!</h1>
			<button class="button-big" onclick="location.reload(true);">
				<span class="button-label-big">Refresh</span>
			</button>
      <p class="dont-worry">Don't worry, it's (probably) not your fault.</p>
			<p>If the problem persists after refreshing, please contact your instance's administrator.<br>You may also try the following options:</p>
      <a href="/flush">
      <button class="button-small">
        <span class="button-label-small">Flush preferences and cache</span>
      </button>
      </a>
			<br>
      <a href="/cli">
        <button class="button-small">
          <span class="button-label-small">Start the simple client</span>
        </button>
      </a>
			<br>
      <a href="/bios">
        <button class="button-small">
          <span class="button-label-small">Attempt to repair in Repair Tool</span>
        </button>
      </a>
			<br>
			<div id="errors"></div>
			`;

			errorsElement = document.getElementById('errors');
		}

		const detailsElement = document.createElement('details');
		detailsElement.innerHTML = `<br><summary><code>ERROR CODE: ${code}</code></summary>${JSON.stringify(details)}`;
		errorsElement.appendChild(detailsElement);
	}

	// eslint-disable-next-line no-inner-declarations
	async function checkUpdate() {
		// TODO: サーバーが落ちている場合などのエラーハンドリング
		const res = await fetch('/api/meta', {
			method: 'POST',
			cache: 'no-cache'
		});

		const meta = await res.json();

		if (meta.version != v) {
			localStorage.setItem('v', meta.version);
			refresh();
		}
	}

	// eslint-disable-next-line no-inner-declarations
	function refresh() {
		// Clear cache (service worker)
		try {
			navigator.serviceWorker.controller.postMessage('clear');
			navigator.serviceWorker.getRegistrations().then(registrations => {
				registrations.forEach(registration => registration.unregister());
			});
		} catch (e) {
			console.error(e);
		}

		location.reload();
	}
})();
