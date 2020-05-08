import { clientDb } from '../db';
import i18n from '../i18n';
import { deepEntries, delimitEntry } from 'deep-entries';
import { fromEntries } from '../../prelude/array';

export function setI18nContexts(lang: string, version: string, clear: boolean = false) {
	Promise.all([
		clear ? clientDb.i18nContexts.clear() : Promise.resolve(),
		fetch(`/assets/locales/${lang}.${version}.json`)
	])
	.then(([, response]) => response.json())
	.then(locale => {
		const flatLocaleEntries = deepEntries(locale, delimitEntry) as [string, string][]
		clientDb.i18nContexts.bulkPut(flatLocaleEntries.map(e => ({ context: e[0], translation: e[1] })))
		i18n.locale = lang;
		i18n.setLocaleMessage(lang, fromEntries(flatLocaleEntries));
	});
}
