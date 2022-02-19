import * as redis from 'redis';
import config from '@/config/index';

export const redisClient = redis.createClient({
	socket: {
		port: config.redis.port,
		host: config.redis.host,
	},
	password: config.redis.pass,
	prefix: config.redis.prefix,
	database: config.redis.db || 0,
});

redisClient.connect();

export const redisSubscriber = redisClient.duplicate();

redisSubscriber.connect();
