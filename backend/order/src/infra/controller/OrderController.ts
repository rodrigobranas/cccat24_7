import Deposit from "../../application/usecase/Deposit";
import ExecuteOrder from "../../application/usecase/ExecuteOrder";
import GetAccount from "../../application/usecase/GetWallet";
import GetOrder from "../../application/usecase/GetOrder";
import PlaceOrder from "../../application/usecase/PlaceOrder";
import Book from "../../domain/Book";
import Order from "../../domain/Order";
import OrderPlacedEvent from "../../domain/OrderPlacedEvent";
import { inject } from "../di/Registry";
import HttpServer from "../http/HttpServer";
import Mediator from "../mediator/Mediator";
import OrderRepository from "../repository/OrderRepository";
import BookGateway from "../gateway/BookGateway";
import Queue from "../queue/Queue";

export default class OrderController {
    @inject("httpServer")
    httpServer!: HttpServer;
    @inject("deposit")
    deposit!: Deposit;
    @inject("placeOrder")
    placeOrder!: PlaceOrder;
    @inject("getOrder")
    getOrder!: GetOrder;
    @inject("executeOrder")
    executeOrder!: ExecuteOrder;
    @inject("mediator")
    mediator!: Mediator;
    @inject("book")
    book!: Book;
    @inject("orderRepository")
    orderRepository!: OrderRepository;
    @inject("bookGateway")
    bookGateway!: BookGateway;
    @inject("queue")
    queue!: Queue;

    constructor () {
        this.httpServer.route("post", "/deposit", async (params: any, body: any) => {
            const output = await this.deposit.execute(body);
            return output;
        });

        this.httpServer.route("post", "/place_order", async (params: any, body: any) => {
            console.log("PlaceOrder");
            const output = await this.placeOrder.execute(body);
            return output;
        });

        this.httpServer.route("get", "/orders/:orderId", async (params: any, body: any) => {
            const output = await this.getOrder.execute(params.orderId);
            return output;
        });

        this.mediator.register("orderPlaced", async (order: Order) => {
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
            // await this.bookGateway.insertOrder(input);
            await this.queue.publish("orderPlaced", input);
        });

        this.httpServer.route("put", "/orders/:orderId", async (params: any, body: any) => {
            console.log("UpdateOrder");
            const order = new Order(body.orderId, body.marketId, body.accountId, body.side, body.quantity, body.price, body.fillQuantity, body.fillPrice, body.status, new Date(body.timestamp));
            await this.orderRepository.updateOrder(order);
        });

        this.queue.consume("orderFilled.updateOrder", async (input: any) => {
            console.log("UpdateOrder");
            const order = new Order(input.orderId, input.marketId, input.accountId, input.side, input.quantity, input.price, input.fillQuantity, input.fillPrice, input.status, new Date(input.timestamp));
            await this.orderRepository.updateOrder(order);
        });
    }
}
