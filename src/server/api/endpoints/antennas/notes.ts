import $ from 'cafy';
import { ID } from '../../../../misc/cafy-id';
import define from '../../define';
import { Antennas, Notes, AntennaNotes } from '../../../../models';
import { makePaginationQuery } from '../../common/make-pagination-query';
import { generateVisibilityQuery } from '../../common/generate-visibility-query';
import { generateMutedUserQuery } from '../../common/generate-muted-user-query';
import { ApiError } from '../../error';

export const meta = {
	tags: ['antennas', 'account', 'notes'],

	requireCredential: true as const,

	kind: 'read:account',

	params: {
		antennaId: {
			validator: $.type(ID),
		},

		limit: {
			validator: $.optional.num.range(1, 100),
			default: 10
		},

		sinceId: {
			validator: $.optional.type(ID),
		},

		untilId: {
			validator: $.optional.type(ID),
		},
	},

	errors: {
		noSuchAntenna: {
			message: 'No such antenna.',
			code: 'NO_SUCH_ANTENNA',
			id: '850926e0-fd3b-49b6-b69a-b28a5dbd82fe'
		}
	}
};

export default define(meta, async (ps, user) => {
	const antenna = await Antennas.findOne({
		id: ps.antennaId,
		userId: user.id
	});

	if (antenna == null) {
		throw new ApiError(meta.errors.noSuchAntenna);
	}

	const antennaQuery = AntennaNotes.createQueryBuilder('joining')
		.select('joining.noteId')
		.where('joining.antennaId = :antennaId', { antennaId: antenna.id });

	const query = makePaginationQuery(Notes.createQueryBuilder('note'), ps.sinceId, ps.untilId)
		.andWhere(`note.id IN (${ antennaQuery.getQuery() })`)
		.leftJoinAndSelect('note.user', 'user')
		.setParameters(antennaQuery.getParameters());

	generateVisibilityQuery(query, user);
	generateMutedUserQuery(query, user);

	const notes = await query
		.take(ps.limit!)
		.getMany();

	return await Notes.packMany(notes, user);
});
