import { In } from 'typeorm';
import { publishMainStream } from '@/services/stream.js';
import { pushNotification } from '@/services/push-notification.js';
import { User } from '@/models/entities/user.js';
import { Notification } from '@/models/entities/notification.js';
import { Notifications, Users } from '@/models/index.js';

export async function readNotification(
	userId: User['id'],
	notificationIds: Notification['id'][],
) {
	if (notificationIds.length === 0) return;

	// Update documents
	const result = await Notifications.update({
		notifieeId: userId,
		id: In(notificationIds),
		isRead: false,
	}, {
		isRead: true,
	});

	if (result.affected === 0) return;

	if (!await Users.getHasUnreadNotification(userId)) return postReadAllNotifications(userId);
	else return postReadNotifications(userId, notificationIds);
}

export async function readNotificationByQuery(
	userId: User['id'],
	query: Record<string, any>,
) {
	const notificationIds = await Notifications.findBy({
		...query,
		notifieeId: userId,
		isRead: false,
	}).then(notifications => notifications.map(notification => notification.id));

	return readNotification(userId, notificationIds);
}

function postReadAllNotifications(userId: User['id']) {
	publishMainStream(userId, 'readAllNotifications');
	return pushNotification(userId, 'readAllNotifications', undefined);
}

function postReadNotifications(userId: User['id'], notificationIds: Notification['id'][]) {
	publishMainStream(userId, 'readNotifications', notificationIds);
	return pushNotification(userId, 'readNotifications', { notificationIds });
}
