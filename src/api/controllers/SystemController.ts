import {
    Authorized, Body, CurrentUser, JsonController, NotFoundError, OnUndefined, Post
} from 'routing-controllers';

import { env } from '../../env';
import { User } from '../models/User';
import { ElasticsearchService } from '../services/ElasticsearchService';
import { MobileLogRequest } from './requests/MobileLogRequest';

@JsonController('/system')
export class SystemController {
    public constructor(
        private elasticsearchService: ElasticsearchService
    ) { }

    @Authorized(['canLogin'])
    @OnUndefined(NotFoundError)
    @Post('/log/mobile')
    public postMobileLog(
        @Body({ validate: { whitelist: true } }) body: MobileLogRequest,
        @CurrentUser() currentUser: User
    ): Promise<any> {
        return this.elasticsearchService.index(env.elasticsearch.index.mobile, body, true, currentUser.id);
    }
}
