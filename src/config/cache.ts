import { RedisOptions } from 'ioredis';

interface ICaheConfig {
	driver: 'redis';
	config: {
		redis: RedisOptions;
	};
}

export default {
	driver: 'redis',

	config: {
		redis: {
			port: Number(process.env.REDIS_PORT),
			host: process.env.REDIS_HOST,
			password: process.env.REDIS_PASS || undefined,
		},
	},
} as ICaheConfig;
