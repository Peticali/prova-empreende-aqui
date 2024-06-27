import { AccountsService } from './accounts.service';
import { Account } from '@prisma/client';
import { CreateAccountDto } from './dto/accounts.dto';
export declare class AccountsController {
    private readonly accountsService;
    constructor(accountsService: AccountsService);
    createAccount(data: CreateAccountDto): Promise<Account>;
    getAccounts(req: any): Promise<Account[]>;
}
