import { Controller, Get, Post, Body, Query, UseGuards, Request, UploadedFile, UseInterceptors, BadRequestException, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Payment } from '@prisma/client';
import { CreatePaymentDto, PaymentIdDTO } from './dto/payments.dto';
import { ReportDto } from './dto/report.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('payments')
@UseGuards(AuthGuard)
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post()
    async createPayment(@Body() data: CreatePaymentDto): Promise<Payment> {
        return this.paymentsService.createPayment({ ...data });
    }


    @Get('report')
    async getTransactionReport(@Query() params: ReportDto) {
        return this.paymentsService.getTransactionReport({ ...params });
    }

    @Post('upload/:id')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File, @Param('id') id: number) {
        if (!file) {
            throw new BadRequestException('File not found');
        }

        if (!id) {
            throw new BadRequestException('Payment ID not found');
        }
        return this.paymentsService.uploadFile(file, id);
    }
}