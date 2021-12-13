import { Service } from 'typedi';

import { Client } from '@elastic/elasticsearch';

import { env } from '../../env';
import { MobileLogRequest } from '../controllers/requests/MobileLogRequest';

@Service()
export class ElasticsearchService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() { }

    public async index(index: string, body: MobileLogRequest, suffixing: boolean = true, userId?: number): Promise<any> {
        if (suffixing) {
            index = this.getDateIndex(env.elasticsearch.index.mobile);
        }
        const client: Client = (global as any).frameworkSettings.getData('elasticsearch_client');
        if (userId) {
            body.userId = userId;
        }
        if (!body.datetime) {
            body.datetime = (new Date()).toISOString();
        }
        const apiResponse = await client.index({
            index,
            body,
        });
        return apiResponse?.body;
    }

    private getDateIndex(prefix: string): string {
        const today = new Date();
        return `${prefix}-${today.getUTCFullYear()}.${today.getUTCMonth() + 1}.${today.getUTCDate()}`;
    }
}
