import { getJsonSchema } from '@/services/chart/core.js';
import { hashtagChart } from '@/services/chart/index.js';
import define from '../../define.js';

export const meta = {
	tags: ['charts', 'hashtags'],
	requireCredentialPrivateMode: true,

	res: getJsonSchema(hashtagChart.schema),

	allowGet: true,
	cacheSec: 60 * 60,
} as const;

export const paramDef = {
	type: 'object',
	properties: {
		span: { type: 'string', enum: ['day', 'hour'] },
		limit: { type: 'integer', minimum: 1, maximum: 500, default: 30 },
		offset: { type: 'integer', nullable: true, default: null },
		tag: { type: 'string' },
	},
	required: ['span', 'tag'],
} as const;

// eslint-disable-next-line import/no-default-export
export default define(meta, paramDef, async (ps) => {
	return await hashtagChart.getChart(ps.span, ps.limit, ps.offset ? new Date(ps.offset) : null, ps.tag);
});
