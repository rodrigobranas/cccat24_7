import { inject } from "../../infra/di/Registry";
import AccountGateway from "../../infra/gateway/AccountGateway";
import { CieloPaymentGateway, PJBankPaymentGateway } from "../../infra/gateway/PaymentGateway";
import { CieloPaymentProcessor, PJBankPaymentProcessor } from "../../infra/pattern/Fallback";
import Retry from "../../infra/pattern/Retry";
import WalletRepository from "../../infra/repository/WalletRepository";

export default class Deposit {
    @inject("accountGateway")
    accountGateway!: AccountGateway;
    @inject("walletRepository")
    walletRepository!: WalletRepository;

    async execute (input: Input): Promise<void> {
        const account = await this.accountGateway.getAccountById(input.accountId);
        if (!account) throw new Error("Account not found");
        const wallet = await this.walletRepository.getWalletById(input.accountId);
        wallet.deposit(input.assetId, input.quantity);
        await this.walletRepository.updateWallet(wallet);
        const paymentGateway = new CieloPaymentGateway();
        // const paymentGateway = new PJBankPaymentGateway();
        // await Retry.execute(async () => {
        //     const output = await paymentGateway.processTransaction({ amount: input.quantity, creditCardToken: "abc123" });
        //     console.log(output);
        //     if (output.status === "approved") {
        //         console.log("success");
        //     }
        // }, 3, 1000);
        // const pjbankProcessor = new PJBankPaymentProcessor();
        // const cieloPaymentProcessor = new CieloPaymentProcessor(pjbankProcessor);
        // const output = await cieloPaymentProcessor.processPayment({ amount: input.quantity, creditCardToken: "abc123" });
        // console.log(output);
    }
}

type Input = {
    accountId: string,
    assetId: string,
    quantity: number
}
