import { USER_ONLINE_THRESHOLD } from '@/const';
import { Users } from '@/models/index';
import { MoreThan } from 'typeorm';
import define from '../define';

export const meta = {
	tags: ['meta'],

	requireCredential: false,
} as const;

export const paramDef = {
	type: 'object',
	properties: {},
	required: [],
} as const;

// eslint-disable-next-line import/no-default-export
export default define(meta, paramDef, async () => {
	const count = await Users.count({
		lastActiveDate: MoreThan(new Date(Date.now() - USER_ONLINE_THRESHOLD)),
	});

	return {
		count,
	};
});
