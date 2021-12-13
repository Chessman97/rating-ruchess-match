import bluebird from 'bluebird';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import redis from 'redis';

import { env } from '../env';
import { Logger } from '../lib/logger';

const log = new Logger(__filename);
export const redisLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings && env.redis.enabled) {
        bluebird.promisifyAll(redis.RedisClient.prototype);
        bluebird.promisifyAll(redis.Multi.prototype);

        const client = redis.createClient({
            host: env.redis.host,
            port: env.redis.port,
            retry_strategy: (options) => {
                if (options.error) {
                    log.error('Redis Error (retry strategy):', options.error);
                }
                if (options.attempt > 1000) {
                // End reconnecting with built in error
                    log.info('Too many attempts to connect to Redis.');
                    return new Error('Too many attempts to connect to Redis.');
                }
                return 5000;
            },
        });
        client.on('error', (err) => {
            log.error('Redis error: ', err);
        });
        client.on('connect', () => {
            log.info('redis connected');
            log.info(`connected ${client.connected}`);
        });

        settings.setData('redis_client', client);
        settings.onShutdown(() => client.end());
    }
};
