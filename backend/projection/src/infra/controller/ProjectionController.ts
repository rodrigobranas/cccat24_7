import DatabaseConnection from "../database/DatabaseConnection";
import { inject } from "../di/Registry";
import AccountGateway from "../gateway/AccountGateway";
import HttpServer from "../http/HttpServer";
import Queue from "../queue/Queue";

export default class BookController {
    @inject("httpServer")
    httpServer!: HttpServer;
    @inject("queue")
    queue!: Queue;
    @inject("databaseConnection")
    databaseConnection!: DatabaseConnection;
    @inject("accountGateway")
    accountGateway!: AccountGateway;

    constructor () {

        this.queue.consume("orderPlaced.updateOrderProjection", async (input: any) => {
            console.log("orderPlaced.updateOrderProjection", input);
            const account = await this.accountGateway.getAccountById(input.accountId);
            await this.databaseConnection.query(
                "insert into ccca.order (order_id, market_id, account_id, name, email, side, quantity, price, fill_quantity, fill_price, status, timestamp) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
                [
                    input.orderId,
                    input.marketId,
                    input.accountId,
                    account.name,
                    account.email,
                    input.side,
                    input.quantity,
                    input.price,
                    input.fillQuantity,
                    input.fillPrice,
                    input.status,
                    input.timestamp
                ]
            );
        });

        this.queue.consume("orderFilled.updateOrderProjection", async (input: any) => {
            console.log("orderFilled.updateOrderProjection");
            await this.databaseConnection.query("update ccca.order set fill_quantity = $1, fill_price = $2, status = $3 where order_id = $4", [input.fillQuantity, input.fillPrice, input.status, input.orderId]);
        });
    }
}