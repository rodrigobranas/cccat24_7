import { inject } from "../../infra/di/Registry";
import AccountGateway from "../../infra/gateway/AccountGateway";
import OrderRepository from "../../infra/repository/OrderRepository";

export default class GetOrder {
    @inject("orderRepository")
    orderRepository!: OrderRepository;
    @inject("accountGateway")
    accountGateway!: AccountGateway;

    async execute(orderId: string): Promise<Output> {
        const order = await this.orderRepository.getOrderById(orderId);
        // API Composition
        const account = await this.accountGateway.getAccountById(order.getAccountId());
        return {
            orderId: order.getOrderId(),
            marketId: order.getMarketId(),
            accountId: order.getAccountId(),
            name: account.name,
            email: account.email,
            side: order.getSide(),
            quantity: order.getQuantity(),
            price: order.getPrice(),
            fillQuantity: order.getFillQuantity(),
            fillPrice: order.getFillPrice(),
            status: order.getStatus(),
            timestamp: order.getTimestamp()
        };
    }
}

type Output = {
    orderId: string,
    marketId: string,
    accountId: string,
    name: string,
    email: string,
    side: string,
    quantity: number,
    price: number,
    fillQuantity: number,
    fillPrice: number,
    status: string,
    timestamp: Date
}
