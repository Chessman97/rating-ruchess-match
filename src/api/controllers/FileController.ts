/* eslint-disable @typescript-eslint/no-unused-vars */
import { Authorized, JsonController, Post, UploadedFiles } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { createMulterInstance, fileFilterForUserAvatars } from '../../lib/multer';

import { User } from '../models/User';
import { FileService } from '../services/FileService';
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
        private fileService: FileService
    ) { }

    @Post()
    @OpenAPI({ summary: 'Обработка файл', description: 'All users' })
    @ResponseSchema(UserResponse, { description: 'Users', isArray: true })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '401' })
    public find(
        @UploadedFiles(
            'files[]',
            { options: createMulterInstance({ files: 3 }, fileFilterForUserAvatars) }
        ) files: Express.Multer.File[] = []
    ): Promise<User[]> {
        console.log(files);
        return this.fileService.find(files);
    }

}
