import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto, PaymentImagesDTO, PaymentIdDTO } from './dto/payments.dto';
import { ReportDto } from './dto/report.dto';
import { Payment, Account } from '@prisma/client';
import * as AWS from 'aws-sdk';
import * as uuid from "uuid";

@Injectable()
export class PaymentsService {
    constructor(private prisma: PrismaService) { }

    AWS_S3_BUCKET = process.env.BUCKET_NAME;
    s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    async createPayment(data: CreatePaymentDto): Promise<Payment> {
        const account = await this.prisma.account.findUnique({
            where: { id: data.accountId },
        });

        if (!account) {
            throw new BadRequestException('Account not found');
        }

        if (account.initialBalance < data.amount) {
            throw new BadRequestException('Insufficient balance');
        }

        await this.prisma.account.update({
            where: { id: data.accountId },
            data: {
                initialBalance: {
                    decrement: data.amount,
                },
            },
        });

        return this.prisma.payment.create({
            data,
        });
    }

    async getTransactionReport(params: ReportDto): Promise<any> {
        const { accountId, startDate, endDate } = params;


        const accountIdi = parseInt(accountId);

        if (!accountIdi) {
            throw new BadRequestException('Invalid account ID');
        }

        const payments = await this.prisma.payment.findMany({
            where: {
                accountId: accountIdi,
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            },
        });

        const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

        return {
            payments,
            totalAmount,
        };
    }


    async uploadFile(file: Express.Multer.File, data_req: number): Promise<any> {


        const result = this.prisma.paymentImages.findUnique({
            where: { paymentId: data_req },
        });

        if (!result) {
            throw new BadRequestException('Payment not found');
        }

        const seg_file = file.originalname.split(".");
        if (seg_file[seg_file.length - 1].match(/(jpg|jpeg|png|gif)$/)) {
            const params = {
                Bucket: this.AWS_S3_BUCKET,
                Key: uuid.v4(),
                Body: file.buffer,
                ContentType: file.mimetype,
                CreateBucketConfiguration: {
                },
            };


            const already_exists = await this.prisma.paymentImages.findUnique({
                where: { paymentId: data_req },
            });

            if (already_exists) {
                await this.prisma.paymentImages.delete({
                    where: { paymentId: data_req },
                });

                await this.s3.deleteObject({
                    Bucket: this.AWS_S3_BUCKET,
                    Key: already_exists.url.replace("https://", "").split("/")[1],
                }).promise();
            }

            let s3Response = await this.s3.upload(params).promise();
            const data = { url: s3Response.Location, paymentId: data_req }
            return this.prisma.paymentImages.create({ data });
        } else {
            throw new BadRequestException('Invalid file type');
        }

    }


}