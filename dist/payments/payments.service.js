"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const AWS = require("aws-sdk");
const uuid = require("uuid");
let PaymentsService = class PaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.AWS_S3_BUCKET = process.env.BUCKET_NAME;
        this.s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
    }
    async createPayment(data) {
        const account = await this.prisma.account.findUnique({
            where: { id: data.accountId },
        });
        if (!account) {
            throw new common_1.BadRequestException('Account not found');
        }
        if (account.initialBalance < data.amount) {
            throw new common_1.BadRequestException('Insufficient balance');
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
    async getTransactionReport(params) {
        const { accountId, startDate, endDate } = params;
        const accountIdi = parseInt(accountId);
        if (!accountIdi) {
            throw new common_1.BadRequestException('Invalid account ID');
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
    async uploadFile(file, data_req) {
        const result = this.prisma.paymentImages.findUnique({
            where: { paymentId: data_req },
        });
        if (!result) {
            throw new common_1.BadRequestException('Payment not found');
        }
        const seg_file = file.originalname.split(".");
        if (seg_file[seg_file.length - 1].match(/(jpg|jpeg|png|gif)$/)) {
            const params = {
                Bucket: this.AWS_S3_BUCKET,
                Key: uuid.v4(),
                Body: file.buffer,
                ContentType: file.mimetype,
                CreateBucketConfiguration: {},
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
            const data = { url: s3Response.Location, paymentId: data_req };
            return this.prisma.paymentImages.create({ data });
        }
        else {
            throw new common_1.BadRequestException('Invalid file type');
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map