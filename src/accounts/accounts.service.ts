import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Account } from '@prisma/client';
import { CreateAccountDto } from './dto/accounts.dto';

@Injectable()
export class AccountsService {
    constructor(private prisma: PrismaService) { }

    async createAccount(data: CreateAccountDto): Promise<Account> {
        return this.prisma.account.create({
            data,
        });
    }

    async getAccounts(): Promise<Account[]> {
        return this.prisma.account.findMany();
    }
}