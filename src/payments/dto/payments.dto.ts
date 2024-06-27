import { IsNumber, IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreatePaymentDto {
    @IsNumber()
    @IsNotEmpty()
    accountId: number;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    description: string;

}

export class PaymentIdDTO {
    @IsInt()
    @IsNotEmpty()
    paymentId: number;
}

export class PaymentImagesDTO {
    @IsInt()
    @IsNotEmpty()
    paymentId: number;

    @IsString()
    @IsNotEmpty()
    url: string;
}