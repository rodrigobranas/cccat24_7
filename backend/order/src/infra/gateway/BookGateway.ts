import axios from "axios";

export default interface BookGateway {
    insertOrder (order: InputInsertOrder): Promise<void>;
}

type InputInsertOrder = {
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

export class BookGatewayHttp implements BookGateway {

    async insertOrder(order: InputInsertOrder): Promise<void> {
        await axios.post(`http://localhost:3002/markets/${order.marketId}/orders`, order);
    }

}
