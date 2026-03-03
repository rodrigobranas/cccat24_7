import Deposit from "../../src/application/usecase/Deposit";
import GetWallet from "../../src/application/usecase/GetWallet";
import Withdraw from "../../src/application/usecase/Withdraw";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import Registry from "../../src/infra/di/Registry";
import { WalletRepositoryDatabase } from "../../src/infra/repository/WalletRepository";
import { AccountGatewayHttp } from "../../src/infra/gateway/AccountGateway";

let databaseConnection: DatabaseConnection;
let accountGateway: AccountGatewayHttp;
let getWallet: GetWallet;
let deposit: Deposit;
let withdraw: Withdraw;

beforeEach(() => {
    databaseConnection = new PgPromiseAdapter();
    Registry.getInstance().register("databaseConnection", databaseConnection);
    Registry.getInstance().register("walletRepository", new WalletRepositoryDatabase());
    accountGateway = new AccountGatewayHttp();
    Registry.getInstance().register("accountGateway", accountGateway);
    getWallet = new GetWallet();
    deposit = new Deposit();
    withdraw = new Withdraw();
});

test("Deve sacar de uma conta", async () => {
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
    const inputWithdraw = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 10000
    }
    await withdraw.execute(inputWithdraw);
    const outputGetWallet = await getWallet.execute(outputSignup.accountId)
    expect(outputGetWallet.balances[0].assetId).toBe("USD");
    expect(outputGetWallet.balances[0].quantity).toBe(10000);
});

test("Não deve sacar de uma conta que não tem aquele tipo específico de fundo", async () => {
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await accountGateway.signup(input);
    const inputWithdraw = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 10000
    }
    await expect(() => withdraw.execute(inputWithdraw)).rejects.toThrow(new Error("Insufficient funds"));
});

test("Não deve sacar em uma conta sem fundos suficientes para realizar o saque", async () => {
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
    const inputWithdraw = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 20000
    }
    await expect(() => withdraw.execute(inputWithdraw)).rejects.toThrow(new Error("Insufficient funds"));
});

afterEach(async () => {
    await databaseConnection.close();
});
