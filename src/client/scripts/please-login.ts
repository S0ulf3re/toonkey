import { i18n } from '@/i18n';
import { dialog } from '@/os';
import { store } from '@/store';

export function pleaseLogin() {
	if (store.getters.isSignedIn) return;

	dialog({
		title: i18n.global.t('signinRequired'),
		text: null
	});

	throw new Error('signin required');
}
