import DatabaseConnection from "../database/DatabaseConnection";
import { inject } from "../di/Registry";

export default interface AccountDAO {
    getAccountById (accountId: string): Promise<any>;
}

export class AccountDAODatabase implements AccountDAO {
    @inject("databaseConnection")
    databaseConnection!: DatabaseConnection;

    async getAccountById(accountId: string): Promise<any> {
        const [data] = await this.databaseConnection.query("select * from ccca.account where account_id = $1", [accountId]);
        return data;
    }

}
