import es from '../../../../db/elasticsearch';
import define from '../../define';
import { Notes } from '@/models/index';
import { In } from 'typeorm';
import config from '@/config/index';
import { makePaginationQuery } from '../../common/make-pagination-query';
import { generateVisibilityQuery } from '../../common/generate-visibility-query';
import { generateMutedUserQuery } from '../../common/generate-muted-user-query';
import { generateBlockedUserQuery } from '../../common/generate-block-query';

export const meta = {
	tags: ['notes'],

	requireCredential: false,

	res: {
		type: 'array',
		optional: false, nullable: false,
		items: {
			type: 'object',
			optional: false, nullable: false,
			ref: 'Note',
		},
	},

	errors: {
	},
} as const;

export const paramDef = {
	type: 'object',
	properties: {
		query: { type: 'string' },
		sinceId: { type: 'string', format: 'misskey:id' },
		untilId: { type: 'string', format: 'misskey:id' },
		limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
		offset: { type: 'integer', default: 0 },
		host: { type: 'string', nullable: true },
		userId: { type: 'string', format: 'misskey:id', nullable: true, default: null },
		channelId: { type: 'string', format: 'misskey:id', nullable: true, default: null },
	},
	required: ['query'],
} as const;

// eslint-disable-next-line import/no-default-export
export default define(meta, paramDef, async (ps, me) => {
	if (es == null) {
		const query = makePaginationQuery(Notes.createQueryBuilder('note'), ps.sinceId, ps.untilId);

		if (ps.userId) {
			query.andWhere('note.userId = :userId', { userId: ps.userId });
		} else if (ps.channelId) {
			query.andWhere('note.channelId = :channelId', { channelId: ps.channelId });
		}

		query
			.andWhere('note.text ILIKE :q', { q: `%${ps.query}%` })
			.innerJoinAndSelect('note.user', 'user')
			.leftJoinAndSelect('note.reply', 'reply')
			.leftJoinAndSelect('note.renote', 'renote')
			.leftJoinAndSelect('reply.user', 'replyUser')
			.leftJoinAndSelect('renote.user', 'renoteUser');

		generateVisibilityQuery(query, me);
		if (me) generateMutedUserQuery(query, me);
		if (me) generateBlockedUserQuery(query, me);

		const notes = await query.take(ps.limit).getMany();

		return await Notes.packMany(notes, me);
	} else {
		const userQuery = ps.userId != null ? [{
			term: {
				userId: ps.userId,
			},
		}] : [];

		const hostQuery = ps.userId == null ?
			ps.host === null ? [{
				bool: {
					must_not: {
						exists: {
							field: 'userHost',
						},
					},
				},
			}] : ps.host !== undefined ? [{
				term: {
					userHost: ps.host,
				},
			}] : []
		: [];

		const result = await es.search({
			index: config.elasticsearch.index || 'misskey_note',
			body: {
				size: ps.limit,
				from: ps.offset,
				query: {
					bool: {
						must: [{
							simple_query_string: {
								fields: ['text'],
								query: ps.query.toLowerCase(),
								default_operator: 'and',
							},
						}, ...hostQuery, ...userQuery],
					},
				},
				sort: [{
					_doc: 'desc',
				}],
			},
		});

		const hits = result.body.hits.hits.map((hit: any) => hit._id);

		if (hits.length === 0) return [];

		// Fetch found notes
		const notes = await Notes.find({
			where: {
				id: In(hits),
			},
			order: {
				id: -1,
			},
		});

		return await Notes.packMany(notes, me);
	}
});
