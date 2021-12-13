import { IsDateString, IsOptional, IsString } from 'class-validator';

export class MobileLogRequest {

    @IsString()
    public errorId: string;

    @IsString()
    public message: string;

    @IsString()
    public device: string;

    @IsOptional()
    @IsDateString()
    public datetime?: string;

    public userId: number;
}
