import { PaymentsService } from './payments.service';
import { Payment } from '@prisma/client';
import { CreatePaymentDto } from './dto/payments.dto';
import { ReportDto } from './dto/report.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createPayment(data: CreatePaymentDto): Promise<Payment>;
    getTransactionReport(params: ReportDto): Promise<any>;
    uploadFile(file: Express.Multer.File, id: number): Promise<any>;
}
