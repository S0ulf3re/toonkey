import { publishMainStream } from '../stream';
import { Note } from '../../models/entities/note';
import { User } from '../../models/entities/user';
import { NoteUnreads, Antennas, AntennaNotes, Users } from '../../models';
import { Not, IsNull } from 'typeorm';

/**
 * Mark a note as read
 */
export default async function(
	userId: User['id'],
	noteId: Note['id']
) {
	async function careNoteUnreads() {
		const exist = await NoteUnreads.findOne({
			userId: userId,
			noteId: noteId,
		});

		if (!exist) return;

		// Remove the record
		await NoteUnreads.delete({
			userId: userId,
			noteId: noteId,
		});

		if (exist.isMentioned) {
			NoteUnreads.count({
				userId: userId,
				isMentioned: true
			}).then(mentionsCount => {
				if (mentionsCount === 0) {
					// 全て既読になったイベントを発行
					publishMainStream(userId, 'readAllUnreadMentions');
				}
			});
		}

		if (exist.isSpecified) {
			NoteUnreads.count({
				userId: userId,
				isSpecified: true
			}).then(specifiedCount => {
				if (specifiedCount === 0) {
					// 全て既読になったイベントを発行
					publishMainStream(userId, 'readAllUnreadSpecifiedNotes');
				}
			});
		}

		if (exist.noteChannelId) {
			NoteUnreads.count({
				userId: userId,
				noteChannelId: Not(IsNull())
			}).then(channelNoteCount => {
				if (channelNoteCount === 0) {
					// 全て既読になったイベントを発行
					publishMainStream(userId, 'readAllChannels');
				}
			});
		}
	}

	async function careAntenna() {
		const beforeUnread = await Users.getHasUnreadAntenna(userId);
		if (!beforeUnread) return;

		const antennas = await Antennas.find({ userId });

		await Promise.all(antennas.map(async antenna => {
			const countBefore = await AntennaNotes.count({
				antennaId: antenna.id,
				read: false
			});

			if (countBefore === 0) return;

			await AntennaNotes.update({
				antennaId: antenna.id,
				noteId: noteId
			}, {
				read: true
			});

			const countAfter = await AntennaNotes.count({
				antennaId: antenna.id,
				read: false
			});

			if (countAfter === 0) {
				publishMainStream(userId, 'readAntenna', antenna);
			}
		}));

		Users.getHasUnreadAntenna(userId).then(unread => {
			if (!unread) {
				publishMainStream(userId, 'readAllAntennas');
			}
		});
	}

	careNoteUnreads();
	careAntenna();
}
