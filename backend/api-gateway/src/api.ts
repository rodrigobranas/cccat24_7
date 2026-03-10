import BookController from "./infra/controller/APIController";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import Registry from "./infra/di/Registry";
import { ExpressAdapter } from "./infra/http/HttpServer";
import { RabbitMQAdapter } from "./infra/queue/Queue";

async function main () {
    const httpServer = new ExpressAdapter();
    const queue = new RabbitMQAdapter();
    await queue.connect();
    await queue.setup("orderPlaced", "orderPlaced.insertOrderToBook");
    await queue.setup("orderFilled", "orderFilled.updateOrder");
    await queue.setup("placeOrder", "placeOrder.placeOrder");
    Registry.getInstance().register("httpServer", httpServer);
    Registry.getInstance().register("queue", queue);
    Registry.getInstance().register("databaseConnection", new PgPromiseAdapter());
    new BookController();
    httpServer.listen(3003);
}

main();
