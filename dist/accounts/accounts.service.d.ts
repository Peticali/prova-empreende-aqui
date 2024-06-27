import { PrismaService } from '../prisma/prisma.service';
import { Account } from '@prisma/client';
import { CreateAccountDto } from './dto/accounts.dto';
export declare class AccountsService {
    private prisma;
    constructor(prisma: PrismaService);
    createAccount(data: CreateAccountDto): Promise<Account>;
    getAccounts(): Promise<Account[]>;
}
