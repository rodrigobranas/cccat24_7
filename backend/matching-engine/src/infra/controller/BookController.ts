import Book from "../../domain/Book";
import Order from "../../domain/Order";
import { inject } from "../di/Registry";
import OrderGateway from "../gateway/OrderGateway";
import HttpServer from "../http/HttpServer";
import Mediator from "../mediator/Mediator";
import Queue from "../queue/Queue";

export default class BookController {
    @inject("httpServer")
    httpServer!: HttpServer;
    @inject("mediator")
    mediator!: Mediator;
    @inject("book")
    book!: Book;
    @inject("orderGateway")
    orderGateway!: OrderGateway;
    @inject("queue")
    queue!: Queue;

    constructor () {

        this.httpServer.route("post", "/markets/:marketId/orders", async (params: any, body: any) => {
            console.log("insertOrder");
            const order = new Order(body.orderId, body.marketId, body.accountId, body.side, body.quantity, body.price, body.fillQuantity, body.fillPrice, body.status, new Date(body.timestamp));
            await this.book.insert(order);
        });

        this.queue.consume("orderPlaced.insertOrderToBook", async (input: any) => {
            console.log("insertOrder");
            const order = new Order(input.orderId, input.marketId, input.accountId, input.side, input.quantity, input.price, input.fillQuantity, input.fillPrice, input.status, new Date(input.timestamp));
            await this.book.insert(order);
        });

        this.book.register("orderFilled", async (order: Order) => {
            console.log("orderFilled");
            const input = {
                orderId: order.getOrderId(),
                marketId: order.getMarketId(),
                accountId: order.getAccountId(),
                side: order.getSide(),
                quantity: order.getQuantity(),
                price: order.getPrice(),
                fillQuantity: order.getFillQuantity(),
                fillPrice: order.getFillPrice(),
                status: order.getStatus(),
                timestamp: order.getTimestamp()
            }
            // await this.orderGateway.updateOrder(input);
            await this.queue.publish("orderFilled", input);
        });
    }
}
