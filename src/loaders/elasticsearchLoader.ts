import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';

import { Client } from '@elastic/elasticsearch';

import { env } from '../env';
import { Logger } from '../lib/logger';

const log = new Logger(__filename);
export const elasticsearchLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings && env.elasticsearch.enabled) {
        const client = new Client({
            node: env.elasticsearch.host,
        });
        client.on('response', (err, result) => {
            if (err) {
                log.error('Elasticsearch error', { error: err });
            }
        });
        settings.setData('elasticsearch_client', client);
        settings.onShutdown(() => client.close());
    }
};
