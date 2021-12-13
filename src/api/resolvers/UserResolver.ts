import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';

import { User } from '../models/User';
import { UserService } from '../services/UserService';
import { UserArgs } from '../types/args/UserArgs';
import { NewUserInput } from '../types/input/NewUserInput';

@Service()
@Resolver(User)
export class UserResolver {

    public constructor(
        private userService: UserService
    ) { }

    @Query(returns => [User])
    public async users(@Args() { skip, take }: UserArgs): Promise<User[]> {
        return this.userService.find(skip, take);
    }

    @Mutation(returns => User)
    public async addUser(
        @Arg('newUserData') newUserData: NewUserInput,
        @Ctx('user') user: User
    ): Promise<any> {
        return this.userService.addUser(newUserData);
    }

}
