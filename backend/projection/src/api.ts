import BookController from "./infra/controller/ProjectionController";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import Registry from "./infra/di/Registry";
import { AccountGatewayHttp } from "./infra/gateway/AccountGateway";
import { ExpressAdapter } from "./infra/http/HttpServer";
import { RabbitMQAdapter } from "./infra/queue/Queue";

async function main () {
    const httpServer = new ExpressAdapter();
    const queue = new RabbitMQAdapter();
    await queue.connect();
    await queue.setup("orderPlaced", "orderPlaced.insertOrderToBook");
    await queue.setup("orderPlaced", "orderPlaced.updateOrderProjection");
    await queue.setup("orderFilled", "orderFilled.updateOrder");
    await queue.setup("orderFilled", "orderFilled.updateOrderProjection");
    await queue.setup("placeOrder", "placeOrder.placeOrder");
    Registry.getInstance().register("httpServer", httpServer);
    Registry.getInstance().register("queue", queue);
    Registry.getInstance().register("databaseConnection", new PgPromiseAdapter());
    Registry.getInstance().register("accountGateway", new AccountGatewayHttp());
    new BookController();
    httpServer.listen(3004);
}

main();
