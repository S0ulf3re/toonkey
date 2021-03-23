import { v4 as uuid } from 'uuid';
import $ from 'cafy';
import config from '@/config';
import define from '../../../define';
import { ApiError } from '../../../error';
import { Apps, AuthSessions } from '../../../../../models';
import { genId } from '@/misc/gen-id';

export const meta = {
	tags: ['auth'],

	requireCredential: false as const,

	desc: {
		'ja-JP': 'アプリを認証するためのトークンを作成します。',
		'en-US': 'Generate a token for authorize application.'
	},

	params: {
		appSecret: {
			validator: $.str,
			desc: {
				'ja-JP': 'アプリケーションのシークレットキー',
				'en-US': 'The secret key of your application.'
			}
		}
	},

	res: {
		type: 'object' as const,
		optional: false as const, nullable: false as const,
		properties: {
			token: {
				type: 'string' as const,
				optional: false as const, nullable: false as const,
				description: 'セッションのトークン'
			},
			url: {
				type: 'string' as const,
				optional: false as const, nullable: false as const,
				format: 'url',
				description: 'セッションのURL'
			},
		}
	},

	errors: {
		noSuchApp: {
			message: 'No such app.',
			code: 'NO_SUCH_APP',
			id: '92f93e63-428e-4f2f-a5a4-39e1407fe998'
		}
	}
};

export default define(meta, async (ps) => {
	// Lookup app
	const app = await Apps.findOne({
		secret: ps.appSecret
	});

	if (app == null) {
		throw new ApiError(meta.errors.noSuchApp);
	}

	// Generate token
	const token = uuid();

	// Create session token document
	const doc = await AuthSessions.save({
		id: genId(),
		createdAt: new Date(),
		appId: app.id,
		token: token
	});

	return {
		token: doc.token,
		url: `${config.authUrl}/${doc.token}`
	};
});
