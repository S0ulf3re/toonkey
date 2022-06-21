import { AsyncComponentLoader, defineAsyncComponent, inject } from 'vue';
import { Router } from '@/nirax';
import { $i, iAmModerator } from '@/account';
import MkLoading from '@/pages/_loading_.vue';
import MkError from '@/pages/_error_.vue';
import { ui } from '@/config';

const page = (loader: AsyncComponentLoader<any>) => defineAsyncComponent({
	loader: loader,
	loadingComponent: MkLoading,
	errorComponent: MkError,
});

export const routes = [{
	name: 'user',
	path: '/@:acct/:page?',
	component: page(() => import('./pages/user/index.vue')),
}, {
	path: '/@:initUser/pages/:initPageName/view-source',
	component: page(() => import('./pages/page-editor/page-editor.vue')),
}, {
	path: '/@:username/pages/:pageName',
	component: page(() => import('./pages/page.vue')),
}, {
	name: 'note',
	path: '/notes/:noteId',
	component: page(() => import('./pages/note.vue')),
}, {
	path: '/clips/:clipId',
	component: page(() => import('./pages/clip.vue')),
}, {
	path: '/user-info/:userId',
	component: page(() => import('./pages/user-info.vue')),
}, {
	path: '/instance-info/:host',
	component: page(() => import('./pages/instance-info.vue')),
}, {
	name: 'settings',
	path: '/settings/:initialPage(*)?',
	component: page(() => import('./pages/settings/index.vue')),
}, {
	path: '/reset-password/:token?',
	component: page(() => import('./pages/reset-password.vue')),
}, {
	path: '/signup-complete/:code',
	component: page(() => import('./pages/signup-complete.vue')),
}, {
	path: '/announcements',
	component: page(() => import('./pages/announcements.vue')),
}, {
	path: '/about',
	component: page(() => import('./pages/about.vue')),
}, {
	path: '/about-misskey',
	component: page(() => import('./pages/about-misskey.vue')),
}, {
	path: '/featured',
	component: page(() => import('./pages/featured.vue')),
}, {
	path: '/theme-editor',
	component: page(() => import('./pages/theme-editor.vue')),
}, {
	path: '/explore/tags/:tag',
	component: page(() => import('./pages/explore.vue')),
}, {
	path: '/explore',
	component: page(() => import('./pages/explore.vue')),
}, {
	path: '/federation',
	component: page(() => import('./pages/federation.vue')),
}, {
	path: '/emojis',
	component: page(() => import('./pages/emojis.vue')),
}, {
	path: '/search',
	component: page(() => import('./pages/search.vue')),
	query: {
		q: 'query',
		channel: 'channel',
	},
}, {
	path: '/authorize-follow',
	component: page(() => import('./pages/follow.vue')),
}, {
	path: '/share',
	component: page(() => import('./pages/share.vue')),
}, {
	path: '/api-console',
	component: page(() => import('./pages/api-console.vue')),
}, {
	path: '/mfm-cheat-sheet',
	component: page(() => import('./pages/mfm-cheat-sheet.vue')),
}, {
	path: '/scratchpad',
	component: page(() => import('./pages/scratchpad.vue')),
}, {
	path: '/preview',
	component: page(() => import('./pages/preview.vue')),
}, {
	path: '/auth/:token',
	component: page(() => import('./pages/auth.vue')),
}, {
	path: '/miauth/:session',
	component: page(() => import('./pages/miauth.vue')),
	query: {
		callback: 'callback',
		name: 'name',
		icon: 'icon',
		permission: 'permission',
	},
}, {
	path: '/tags/:tag',
	component: page(() => import('./pages/tag.vue')),
}, {
	path: '/pages/new',
	component: page(() => import('./pages/page-editor/page-editor.vue')),
}, {
	path: '/pages/edit/:initPageId',
	component: page(() => import('./pages/page-editor/page-editor.vue')),
}, {
	path: '/pages',
	component: page(() => import('./pages/pages.vue')),
}, {
	path: '/gallery/:postId/edit',
	component: page(() => import('./pages/gallery/edit.vue')),
}, {
	path: '/gallery/new',
	component: page(() => import('./pages/gallery/edit.vue')),
}, {
	path: '/gallery/:postId',
	component: page(() => import('./pages/gallery/post.vue')),
}, {
	path: '/gallery',
	component: page(() => import('./pages/gallery/index.vue')),
}, {
	path: '/channels/:channelId/edit',
	component: page(() => import('./pages/channel-editor.vue')),
}, {
	path: '/channels/new',
	component: page(() => import('./pages/channel-editor.vue')),
}, {
	path: '/channels/:channelId',
	component: page(() => import('./pages/channel.vue')),
}, {
	path: '/channels',
	component: page(() => import('./pages/channels.vue')),
}, {
	path: '/admin/file/:fileId',
	component: iAmModerator ? page(() => import('./pages/admin-file.vue')) : page(() => import('./pages/not-found.vue')),
}, {
	path: '/admin/:initialPage(*)?',
	component: iAmModerator ? page(() => import('./pages/admin/index.vue')) : page(() => import('./pages/not-found.vue')),
}, {
	path: '/my/notifications',
	component: page(() => import('./pages/notifications.vue')),
}, {
	path: '/my/favorites',
	component: page(() => import('./pages/favorites.vue')),
}, {
	path: '/my/messages',
	component: page(() => import('./pages/messages.vue')),
}, {
	path: '/my/mentions',
	component: page(() => import('./pages/mentions.vue')),
}, {
	name: 'messaging',
	path: '/my/messaging',
	component: page(() => import('./pages/messaging/index.vue')),
}, {
	path: '/my/messaging/:userAcct',
	component: page(() => import('./pages/messaging/messaging-room.vue')),
}, {
	path: '/my/messaging/group/:groupId',
	component: page(() => import('./pages/messaging/messaging-room.vue')),
}, {
	path: '/my/drive/folder/:folder',
	component: page(() => import('./pages/drive.vue')),
}, {
	path: '/my/drive',
	component: page(() => import('./pages/drive.vue')),
}, {
	path: '/my/follow-requests',
	component: page(() => import('./pages/follow-requests.vue')),
}, {
	path: '/my/lists/:listId',
	component: page(() => import('./pages/my-lists/list.vue')),
}, {
	path: '/my/lists',
	component: page(() => import('./pages/my-lists/index.vue')),
}, {
	path: '/my/clips',
	component: page(() => import('./pages/my-clips/index.vue')),
}, {
	path: '/my/antennas/create',
	component: page(() => import('./pages/my-antennas/create.vue')),
}, {
	path: '/my/antennas/:antennaId',
	component: page(() => import('./pages/my-antennas/edit.vue')),
}, {
	path: '/my/antennas',
	component: page(() => import('./pages/my-antennas/index.vue')),
}, {
	path: '/timeline/list/:listId',
	component: page(() => import('./pages/user-list-timeline.vue')),
}, {
	path: '/timeline/antenna/:antennaId',
	component: page(() => import('./pages/antenna-timeline.vue')),
}, {
	name: 'index',
	path: '/',
	component: $i ? page(() => import('./pages/timeline.vue')) : page(() => import('./pages/welcome.vue')),
	globalCacheKey: 'index',
}, {
	path: '/(*)',
	component: page(() => import('./pages/not-found.vue')),
}];

export const mainRouter = new Router(routes, location.pathname + location.search);

window.history.replaceState({ key: mainRouter.getCurrentKey() }, '', location.href);

// TODO: このファイルでスクロール位置も管理する設計だとdeckに対応できないのでなんとかする
// スクロール位置取得+スクロール位置設定関数をprovideする感じでも良いかも

const scrollPosStore = new Map<string, number>();

window.setInterval(() => {
	scrollPosStore.set(window.history.state?.key, window.scrollY);
}, 1000);

mainRouter.addListener('push', ctx => {
	window.history.pushState({ key: ctx.key }, '', ctx.path);
	const scrollPos = scrollPosStore.get(ctx.key) ?? 0;
	window.scroll({ top: scrollPos, behavior: 'instant' });
	if (scrollPos !== 0) {
		window.setTimeout(() => { // 遷移直後はタイミングによってはコンポーネントが復元し切ってない可能性も考えられるため少し時間を空けて再度スクロール
			window.scroll({ top: scrollPos, behavior: 'instant' });
		}, 1000);
	}
});

window.addEventListener('popstate', (event) => {
	mainRouter.change(location.pathname + location.search, event.state?.key);
	const scrollPos = scrollPosStore.get(event.state?.key) ?? 0;
	window.scroll({ top: scrollPos, behavior: 'instant' });
	window.setTimeout(() => { // 遷移直後はタイミングによってはコンポーネントが復元し切ってない可能性も考えられるため少し時間を空けて再度スクロール
		window.scroll({ top: scrollPos, behavior: 'instant' });
	}, 1000);
});

export function useRouter(): Router {
	return inject<Router | null>('router', null) ?? mainRouter;
}
