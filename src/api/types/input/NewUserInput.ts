import { Length, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class NewUserInput {
    @Field()
    @MaxLength(30)
    public firstName: string;

    @MaxLength(30)
    @Field({ nullable: true })
    public lastName?: string;

    @Field()
    @Length(1, 255)
    public username: string;
}
