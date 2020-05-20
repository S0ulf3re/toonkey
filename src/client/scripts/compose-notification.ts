import getNoteSummary from '../../misc/get-note-summary';
import getUserName from '../../misc/get-user-name';
import { clientDb, get } from '../db';
import { fromEntries } from '../../prelude/array';

const getTranslation = (text: string): Promise<string> => get(text, clientDb.i18nContexts)

export default async function(type, data): Promise<[string, NotificationOptions]> {
	const contexts = ['deletedNote', 'invisibleNote', 'withNFiles', '_cw.poll'];
	const locale = await Promise.all(contexts.map(c => getTranslation(c)))
		.then(translations => fromEntries(translations.map((translation, i) => [contexts[i], translation])));

	console.log(type, data)

	switch (type) {
		case 'driveFileCreated': // TODO (Server Side)
			console.log(type)
			return [await getTranslation('fileUploaded'), {
				body: data.name,
				icon: data.url
			}];
		case 'notification':
			console.log(type)
			switch (data.type) {
				case 'mention':
					return [(await getTranslation('youGotMention')).replace('{name}', getUserName(data.user)), {
						body: getNoteSummary(data.note, locale),
						icon: data.user.avatarUrl
					}];

				case 'reply':
					return [(await getTranslation('youGotReply')).replace('{name}', getUserName(data.user)), {
						body: getNoteSummary(data.note, locale),
						icon: data.user.avatarUrl
					}];

				case 'quote':
					return [(await getTranslation('youGotQuote')).replace('{name}', getUserName(data.user)), {
						body: getNoteSummary(data.note, locale),
						icon: data.user.avatarUrl
					}];

				case 'reaction':
					return [`${data.reaction} ${getUserName(data.user)}`, {
						body: getNoteSummary(data.note, locale),
						icon: data.user.avatarUrl
					}];

				default:
					return null;
			}
		case 'unreadMessagingMessage':
			console.log(type)
			if (data.groupId === null) {
				return [(await getTranslation('youGotMessagingMessageFromUser')).replace('{name}', getUserName(data.user)), {
					icon: data.user.avatarUrl,
					tag: `messaging:user:${data.user.id}`
				}];
			}
			return [(await getTranslation('youGotMessagingMessageFromGroup')).replace('{name}', data.group.name), {
				icon: data.user.avatarUrl,
				tag: `messaging:group:${data.group.id}`
			}];
		default:
			console.log(null)
			return null;
	}
}
