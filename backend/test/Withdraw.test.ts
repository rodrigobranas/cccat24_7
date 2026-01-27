import Deposit from "../src/application/usecase/Deposit";
import GetAccount from "../src/application/usecase/GetAccount";
import Signup from "../src/application/usecase/Signup";
import Withdraw from "../src/application/usecase/Withdraw";
import DatabaseConnection, { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository";

let databaseConnection: DatabaseConnection;
let signup: Signup;
let getAccount: GetAccount;
let deposit: Deposit;
let withdraw: Withdraw;

beforeEach(() => {
    databaseConnection = new PgPromiseAdapter();
    const accountDAO = new AccountRepositoryDatabase(databaseConnection);
    signup = new Signup(accountDAO);
    getAccount = new GetAccount(accountDAO);
    deposit = new Deposit(accountDAO);
    withdraw = new Withdraw(accountDAO);
});

test("Deve sacar de uma conta", async () => {
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(input);
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
    const outputGetAccount = await getAccount.execute(outputSignup.accountId)
    expect(outputGetAccount.balances[0].assetId).toBe("USD");
    expect(outputGetAccount.balances[0].quantity).toBe(10000);
});

test("Não deve sacar de uma conta que não tem aquele tipo específico de fundo", async () => {
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(input);
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
    const outputSignup = await signup.execute(input);
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
