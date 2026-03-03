import { inject } from "../../infra/di/Registry";
import AccountGateway from "../../infra/gateway/AccountGateway";
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
    }
}

type Input = {
    accountId: string,
    assetId: string,
    quantity: number
}
