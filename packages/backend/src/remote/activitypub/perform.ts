import { IObject } from './type.js';
import { CacheableRemoteUser } from '@/models/entities/user.js';
import { performActivity } from './kernel/index.js';

export default async (actor: CacheableRemoteUser, activity: IObject): Promise<void> => {
	await performActivity(actor, activity);
};
