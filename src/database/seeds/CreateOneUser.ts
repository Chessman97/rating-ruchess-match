import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm/connection/Connection';

import { User } from '../../api/models/User';

// export DEFAULT!!!
export default class CreateUsers implements Seeder {

    /* public async run(factory: Factory, connection: Connection): Promise<any> {
        await factory(User)().createMany(10);
    }
    */
    public async run(factory: Factory, connection: Connection): Promise<any> {
        await factory(User)().create();
    }
}
