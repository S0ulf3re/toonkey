import $ from 'cafy';
import define from '../../define';
import { AccessTokens } from '../../../../models';
import { genId } from '../../../../misc/gen-id';
import { secureRndstr } from '../../../../misc/secure-rndstr';

export const meta = {
	tags: ['auth'],

	requireCredential: true as const,

	secure: true,

	params: {
		session: {
			validator: $.nullable.str
		},

		name: {
			validator: $.nullable.optional.str
		},

		description: {
			validator: $.nullable.optional.str,
		},

		iconUrl: {
			validator: $.nullable.optional.str,
		},

		permission: {
			validator: $.arr($.str).unique(),
		},
	},
};

export default define(meta, async (ps, user) => {
	// Generate access token
	const accessToken = secureRndstr(32, true);

	// Insert access token doc
	await AccessTokens.save({
		id: genId(),
		createdAt: new Date(),
		lastUsedAt: new Date(),
		session: ps.session,
		userId: user.id,
		token: accessToken,
		hash: accessToken,
		name: ps.name,
		description: ps.description,
		iconUrl: ps.iconUrl,
		permission: ps.permission,
	});

	return {
		token: accessToken
	};
});
