import { IsString, IsNumber, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateAccountDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    accountType: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    initialBalance: number;

}