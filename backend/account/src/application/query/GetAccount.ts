import AccountDAO from "../../infra/dao/AccountDAO";
import { inject } from "../../infra/di/Registry";

export default class GetAccount {
    @inject("accountDAO")
    accountDAO!: AccountDAO;

    async execute (accountId: string): Promise<Output> {
        const account = await this.accountDAO.getAccountById(accountId);
        if (!account) throw new Error("Account not found");
        const output = {
            accountId: account.account_id,
            name: account.name,
            email: account.email,
            document: account.document,
            password: account.password
        }
        return output;
    }
}

type Output = {
    accountId: string,
    name: string,
    email: string,
    document: string,
    password: string
}
