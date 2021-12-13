import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { events } from '../subscribers/events';
import { NewUserInput } from '../types/input/NewUserInput';

@Service()
export class UserService {

    public constructor(
        @OrmRepository() private userRepository: UserRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async find(skip: number = 0, take: number = 20): Promise<User[]> {
        this.log.info('UserService:find', { skip, take });
        return await this.userRepository.find({ skip, take });
    }

    public findOne(id: number): Promise<User | undefined> {
        this.log.info('UserService:findOne', { userId: id });
        return this.userRepository.findOne({ id });
    }

    public async create(user: User): Promise<User> {
        this.log.info('UserService:create', { userId: user.id });
        const newUser = await this.userRepository.save(user);
        this.eventDispatcher.dispatch(events.user.created, newUser);
        return newUser;
    }

    public async update(id: number, user: User): Promise<User> {
        this.log.info('UserService:update', { userId: id });
        return this.userRepository.save(user);
    }

    public async delete(id: number): Promise<void> {
        this.log.info('UserService:delete', { userId: id });
        await this.userRepository.delete(id);
        return;
    }

    // Метод для добавления нового пользователя в базу данных
    public async addUser(newUser: NewUserInput): Promise<User> {
        this.log.info('UserService:addUser', { newUser });
        const newUserEntity = new User();
        if (newUser.firstName) {
            newUserEntity.firstName = newUser.firstName;
        }
        if (newUser.lastName) {
            newUserEntity.lastName = newUser.lastName;
        }
        newUserEntity.username = newUser.username;
        const user = await this.userRepository.save(newUserEntity);
        this.log.info('UserService:addUser:created', { userId: user.id });
        return user;
    }

}
