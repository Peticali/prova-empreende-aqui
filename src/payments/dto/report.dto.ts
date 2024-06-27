import { IsNumber, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class ReportDto {
    @IsString()
    @IsNotEmpty()
    accountId: string;

    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsNotEmpty()
    endDate: string;

}