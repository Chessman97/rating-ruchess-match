import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './User';

@ObjectType({
    description: 'User object.',
})
@Entity()
export class Locale {

    @Field(type => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Field({
        description: 'Locale name',
    })
    @Column({ name: 'name', nullable: false, type: 'text' })
    public name: string;

    @Field({
        description: 'Locale code',
    })
    @Column({ name: 'code', nullable: false, type: 'text' })
    public code: string;

    @OneToMany(() => User, users => users.locale)
    public users: User[];

}
