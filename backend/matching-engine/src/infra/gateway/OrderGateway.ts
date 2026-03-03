import axios from "axios";

export default interface OrderGateway {
    updateOrder (order: InputUpdateOrder): Promise<void>;
}

type InputUpdateOrder = {
    orderId: string,
    marketId: string,
    accountId: string,
    side: string,
    quantity: number,
    price: number,
    fillQuantity: number,
    fillPrice: number,
    status: string,
    timestamp: Date
}

export class OrderGatewayHttp implements OrderGateway {

    async updateOrder(order: InputUpdateOrder): Promise<void> {
        await axios.put(`http://localhost:3001/orders/${order.orderId}`, order);
    }

}