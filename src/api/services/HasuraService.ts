import rp from 'request-promise';
import { Service } from 'typedi';

import { env } from '../../env';

@Service()
export class HasuraService {

    public hasuraWebhookHandle(accessToken: string): { 'X-Hasura-Role': string; 'X-Hasura-Admin-Secret': string } {
        if (accessToken === env.hasura.secret) {
            return {
                'X-Hasura-Role': 'user',
                'X-Hasura-Admin-Secret': accessToken,
            };
        }
        return {
            'X-Hasura-Role': 'anon',
            'X-Hasura-Admin-Secret': '',
        };
    }

    public async handleAdminRequest(body: any): Promise<any> {
        const passRequestOptions = {
            uri: env.hasura.remote,
            method: 'POST',
            json: true,
            body,
            headers: {
                'content-type': 'application/json',
                'cache-control': 'no-cache',
                'connection': 'keep-alive',
                'X-Hasura-Admin-Secret': env.hasura.secret,
            },
        };
        return await rp(passRequestOptions);
    }
}
