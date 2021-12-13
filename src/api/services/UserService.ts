import { Service } from 'typedi';

import { Logger, LoggerInterface } from '../../decorators/Logger';

@Service()
export class UserService {

    public constructor(
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async find(skip: number = 0, take: number = 20): Promise<any> {
        this.log.info('UserService:find', { skip, take });
        return true;
    }

}
