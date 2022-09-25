// Icons for empty lists are arranged by individual ideas. And are intentionally kept simple by specific concept, so that we don't need to make
export const emptyIcons = [
	// Explore
	{
		path: '/static-assets/badges/EmptyIcons/user.png',
		name: 'user',
	},
	{
		path: '/static-assets/badges/EmptyIcons/group.png',
		name: 'group',
	},
	{
		path: '/static-assets/badges/EmptyIcons/groupInvite.png',
		name: 'groupInvite',
	},
	{
		path: '/static-assets/badges/EmptyIcons/channel.png',
		name: 'channel',
	},
	{
		path: '/static-assets/badges/EmptyIcons/federation.png',
		name: 'federation',
	},
	{
		path: '/static-assets/badges/EmptyIcons/popular.png',
		name: 'popular',
	},
	{
		path: '/static-assets/badges/EmptyIcons/recent.png',
		name: 'recent',
	},
	{
		path: '/static-assets/badges/EmptyIcons/follow.png',
		name: 'follow',
	},
	{
		path: '/static-assets/badges/EmptyIcons/mention.png',
		name: 'mention',
	},
	{
		path: '/static-assets/badges/EmptyIcons/page.png',
		name: 'page',
	},
	{
		path: '/static-assets/badges/EmptyIcons/emoji.png',
		name: 'emoji',
	},
	{
		path: '/static-assets/badges/EmptyIcons/antenna.png',
		name: 'antenna',
	},
	{
		path: '/static-assets/badges/EmptyIcons/search.png',
		name: 'search',
	},
	{
		path: '/static-assets/badges/EmptyIcons/favorite.png',
		name: 'favorite',
	},
	{
		path: '/static-assets/badges/EmptyIcons/reaction.png',
		name: 'reaction',
	},
	{
		path: '/static-assets/badges/EmptyIcons/chat.png',
		name: 'chat',
	},
	{
		path: '/static-assets/badges/EmptyIcons/notification.png',
		name: 'notification',
	},
	{
		path: '/static-assets/badges/EmptyIcons/gallery.png',
		name: 'gallery',
	},
	{
		path: '/static-assets/badges/EmptyIcons/clip.png',
		name: 'clip',
	},
	{
		path: '/static-assets/badges/EmptyIcons/announcement.png',
		name: 'announcement',
	},
	{
		path: '/static-assets/badges/EmptyIcons/list.png',
		name: 'list',
	},
	{
		path: '/static-assts/badges/EmptyIcons/drive.png',
		name: 'drive',
	},

	// A generic object, serves as the fallback for any empty icons that don't specify anything (basically legacy, in development, or placeholder).
	// Uses the classic calckey icon. This should always be the last icon in the array.
	{
		path: '/static-assets/badges/info.png',
		name: 'genericFallback',
	},
];

export function retrieveEmptyIcon(name: string) {
	const emptyIconPath = emptyIcons.find((icon) => icon.name === name)?.path;
	const fallbackIconPath = emptyIcons[emptyIcons.length - 1]?.path

	if (!emptyIconPath || emptyIconPath === '') {
		console.warn('File path not found, using fallback icon instead.');
		return fallbackIconPath;
	} else {
		return emptyIconPath;
	}
	
	if (emptyIconPath === '' || emptyIconPath === undefined) {
		console.warn('Empty icon path is empty. Using fallback icon');
	}

}
