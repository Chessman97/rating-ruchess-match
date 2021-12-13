import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Locale } from './Locale';

@ObjectType({
    description: 'User object.',
})
@Entity()
export class User {

    @Field(type => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Field({
        description: 'The first name of the user.',
    })
    @Column()
    public firstName: string;

    @Field({
        description: 'The last name of the user.',
    })
    @Column()
    public lastName?: string;

    @Field({
        description: 'The username of the user.',
    })
    @Column()
    public username: string;

    @Field({
        description: 'User locale id',
    })
    @Column({ name: 'locale_id', nullable: false, type: 'integer' })
    public localeId: number;

    @Field(type => Locale, {
        description: 'User locale object',
    })
    @ManyToOne(() => Locale, locale => locale.users)
    @JoinColumn({ name: 'locale_id' })
    public locale: Locale;
}
