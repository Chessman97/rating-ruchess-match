import { Authorized, Body, Get, HeaderParams, JsonController, Post } from 'routing-controllers';

import { AccessToken } from '../../decorators/AccessToken';
import { HasuraService } from '../services/HasuraService';

@JsonController('/hasura')
export class HasuraController {
    public constructor(
        private hasuraService: HasuraService
    ) { }

    @Get()
    public async hasuraWebhookHandle(@AccessToken() accessToken: string): Promise<any> {
        return this.hasuraService.hasuraWebhookHandle(accessToken);
    }

    @Authorized()
    @Post('/admin/graphql')
    public async hasuraAdminRequest(@Body() body: any, @HeaderParams() headers: any): Promise<any> {
        return this.hasuraService.handleAdminRequest(body);
    }
}
