import { IsInt, IsNotEmpty } from 'class-validator';

export class UserResponse {
    @IsInt()
    public id: string;

    @IsNotEmpty()
    public firstName: string;

    @IsNotEmpty()
    public lastName: string;

    @IsInt()
    @IsNotEmpty()
    public chatId: number;

    @IsNotEmpty()
    public username: string;
}
