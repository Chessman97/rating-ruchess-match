import { Authorized, JsonController, Post, UploadedFiles } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { createMulterInstance, fileFilterForUserAvatars } from '../../lib/multer';

import { User } from '../models/User';
import { UserService } from '../services/UserService';
import { ErrorResponse } from './responses/ErrorResponse';
import { UserResponse } from './responses/UserResponse';

@Authorized()
@JsonController('/file')
@OpenAPI({
    security: [{ ApiKeyAuth: [] }],
    tags: ['File'],
})
export class FileController {

    public constructor(
        private userService: UserService
    ) { }

    @Post()
    @OpenAPI({
        summary: 'Get all users', description: 'All users', parameters: [{
            in: 'query', name: 'pageSize', type: 'integer',
        }],
    })
    @ResponseSchema(UserResponse, { description: 'Users', isArray: true })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '401' })
    public find(
        @UploadedFiles(
            'files[]',
            { options: createMulterInstance({ files: 3 }, fileFilterForUserAvatars) }
        ) files: Express.Multer.File[] = []
    ): Promise<User[]> {
        console.log(files);
        return this.userService.find(undefined, undefined);
    }

}
