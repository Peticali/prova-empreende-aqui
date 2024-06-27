import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/payments.dto';
import { ReportDto } from './dto/report.dto';
import { Payment } from '@prisma/client';
import * as AWS from 'aws-sdk';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    AWS_S3_BUCKET: string;
    s3: AWS.S3;
    createPayment(data: CreatePaymentDto): Promise<Payment>;
    getTransactionReport(params: ReportDto): Promise<any>;
    uploadFile(file: Express.Multer.File, data_req: number): Promise<any>;
}
