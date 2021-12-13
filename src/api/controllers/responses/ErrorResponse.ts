import { IsArray, IsString } from 'class-validator';

export class ErrorResponse {
    @IsString()
    public name: string;

    @IsString()
    public message: string;

    @IsArray()
    public errors: [];
}
