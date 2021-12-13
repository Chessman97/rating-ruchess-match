import * as Faker from 'faker';
import { define } from 'typeorm-seeding';

import { User } from '../../api/models/User';

define(User, (faker: typeof Faker) => {
    const gender = faker.random.number(1);
    const firstName = faker.name.firstName(gender);
    const lastName = faker.name.lastName(gender);

    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.username = faker.random.word();
    return user;
});

