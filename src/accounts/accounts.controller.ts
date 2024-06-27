import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account } from '@prisma/client';
import { CreateAccountDto } from './dto/accounts.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('accounts')
@UseGuards(AuthGuard)
export class AccountsController {
    constructor(private readonly accountsService: AccountsService) { }

    @Post()
    async createAccount(@Body() data: CreateAccountDto): Promise<Account> {
        return this.accountsService.createAccount({ ...data });
    }

    @Get()
    async getAccounts(@Request() req): Promise<Account[]> {
        return this.accountsService.getAccounts();
    }
}