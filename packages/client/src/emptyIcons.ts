
// Icons for empty lists are arranged by individual ideas. And are intentionally kept simple by specific concept, so that we don't need to make
export const emptyIcons = [
	// Explore
	{
		path: '/path/to/file',
		name: 'user'
	}, {
		path: '/path/to/file',
		name: 'channel'
	}, {
		path: '/path/to/file',
		name: 'page'
	}, {
		path: '/path/to/file',
		name: 'antenna'
	}, {
		path: '/path/to/file',
		name: 'search'
	}, {
		path: '/path/to/file',
		name: 'favorite'
	}, {
		path: '/path/to/file',
		name: 'reaction'
	}, {
		path: '/path/to/file',
		name: 'chat'
	}, {
		path: '/path/to/file',
		name: 'notification'
	}, {
		path: '/path/to/file',
		name: 'gallery'
	}, {
		path: '/path/to/file',
		name: 'clip'
	}, {
		path: '/path/to/file',
		name: 'announcement'
	}, {
		path: '/path/to/file',
		name: 'list'
	}, {
		path: '/path/to/file',
		name: 'drive'
	},

	// A generic object, serves as the fallback for any empty icons that don't specify anything (basically legacy, in development, or placeholder).
	// Uses the classic calckey icon. This should always be the last icon in this array.
	{
		path: '/static-assets/badges/info.png',
		name: 'genericFallback'
	},]

function retrieveEmptyIconPath(name: string) {
	return emptyIcons.find((icon) => icon.name === name)?.path;
}

function verifyIfIconExistsatPath(name: string) {
	return emptyIcons.find((icon) => icon.name === name) !== undefined;
}

export function retrieveEmptyIcon(name: string) {
	console.log('Retrieving empty icon: ' + name);
	if (verifyIfIconExistsatPath(name) === true) {
		return retrieveEmptyIconPath(name);
	} else {
		return retrieveEmptyIconPath('genericFallback');
	}
}
