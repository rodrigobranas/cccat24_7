import Account from "../../domain/Account";
import Balance from "../../domain/Balance";
import DatabaseConnection from "../database/DatabaseConnection";


export default interface AccountRepository {
    saveAccount (account: Account): Promise<void>;
    updateAccount (account: Account): Promise<void>;
    getAccountById (accountId: string): Promise<Account>;
}

export class AccountRepositoryDatabase implements AccountRepository {

    constructor (readonly connection: DatabaseConnection) {
    }

    async saveAccount (account: Account) {
        await this.connection.query("insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)", [account.accountId, account.getName(), account.email, account.document, account.password]);
    }

    async updateAccount (account: Account) {
        await this.connection.query("delete from ccca.balance where account_id = $1", [account.accountId]);
        for (const balance of account.balances) {
            await this.connection.query("insert into ccca.balance (account_id, asset_id, quantity) values ($1, $2, $3)", [account.accountId, balance.assetId, balance.quantity]);
        }
    }

    async getAccountById (accountId: string): Promise<Account> {
        const [account] = await this.connection.query("select * from ccca.account where account_id = $1", [accountId]);
        if (!account) throw new Error("Account not found");
        const balancesData = await this.connection.query("select * from ccca.balance where account_id = $1", [accountId]);
        const balances = balancesData.map((balanceData: any) => (new Balance(balanceData.asset_id, parseFloat(balanceData.quantity))));
        return new Account(account.account_id, account.name, account.email, account.document, account.password, balances);
    }
}

// Fake
export class AccountRepositoryMemory implements AccountRepository {
    accounts: Account[] = [];

    async saveAccount(account: Account): Promise<void> {
        this.accounts.push(account);
    }

    async updateAccount(account: Account): Promise<void> {
        this.accounts.push(account);
    }

    async getAccountById(accountId: string): Promise<Account> {
        const account = this.accounts.find((account: Account) => account.accountId === accountId);
        if (!account) throw new Error("Account not found");
        return account;
    }

}
