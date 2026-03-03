import Balance from "../../domain/Balance";
import Registry, { inject } from "../../infra/di/Registry";
import WalletRepository from "../../infra/repository/WalletRepository";

export default class GetWallet {
    @inject("walletRepository")
    walletRepository!: WalletRepository;

    async execute (accountId: string): Promise<Output> {
        const wallet = await this.walletRepository.getWalletById(accountId);
        const output = {
            accountId: accountId,
            balances: wallet.balances.map((balance: Balance) => ({ assetId: balance.assetId, quantity: balance.quantity }))
        }
        return output;
    }
}

type Output = {
    accountId: string,
    balances: { assetId: string, quantity: number }[]
}
