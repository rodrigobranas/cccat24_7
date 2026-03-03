import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import Deposit from "../../src/application/usecase/Deposit";
import GetWallet from "../../src/application/usecase/GetWallet";
import { WalletRepositoryDatabase } from "../../src/infra/repository/WalletRepository";
import Registry from "../../src/infra/di/Registry";
import { AccountGatewayHttp } from "../../src/infra/gateway/AccountGateway";

let databaseConnection: DatabaseConnection;
let accountGateway: AccountGatewayHttp;
let getWallet: GetWallet;
let deposit: Deposit;

beforeEach(() => {
    databaseConnection = new PgPromiseAdapter();
    Registry.getInstance().register("databaseConnection", databaseConnection);
    Registry.getInstance().register("walletRepository", new WalletRepositoryDatabase());
    accountGateway = new AccountGatewayHttp();
    Registry.getInstance().register("accountGateway", accountGateway);
    getWallet = new GetWallet();
    deposit = new Deposit();
});

test("Deve depositar em uma conta", async () => {
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await accountGateway.signup(input);
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 10000
    }
    await deposit.execute(inputDeposit);
    const outputGetWallet = await getWallet.execute(outputSignup.accountId)
    expect(outputGetWallet.balances[0].assetId).toBe("USD");
    expect(outputGetWallet.balances[0].quantity).toBe(10000);
});

test("Deve depositar duas vezes em uma conta", async () => {
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await accountGateway.signup(input);
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 10000
    }
    await deposit.execute(inputDeposit);
    await deposit.execute(inputDeposit);
    const outputGetWallet = await getWallet.execute(outputSignup.accountId)
    expect(outputGetWallet.balances[0].assetId).toBe("USD");
    expect(outputGetWallet.balances[0].quantity).toBe(20000);
});

test("Não deve depositar em uma conta que não existe", async () => {
    const inputDeposit = {
        accountId: crypto.randomUUID(),
        assetId: "USD",
        quantity: 10000
    }
    await expect(() => deposit.execute(inputDeposit)).rejects.toThrow(new Error("Account not found"));
});

afterEach(async () => {
    await databaseConnection.close();
});
