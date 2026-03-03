import Book from "./domain/Book";
import BookController from "./infra/controller/BookController";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import Registry from "./infra/di/Registry";
import { OrderGatewayHttp } from "./infra/gateway/OrderGateway";
import { ExpressAdapter } from "./infra/http/HttpServer";
import Mediator from "./infra/mediator/Mediator";
import { RabbitMQAdapter } from "./infra/queue/Queue";

async function main () {
    const httpServer = new ExpressAdapter();
    const queue = new RabbitMQAdapter();
    await queue.connect();
    await queue.setup("orderPlaced", "orderPlaced.insertOrderToBook");
    await queue.setup("orderFilled", "orderFilled.updateOrder");
    Registry.getInstance().register("httpServer", httpServer);
    Registry.getInstance().register("queue", queue);
    Registry.getInstance().register("mediator", new Mediator());
    Registry.getInstance().register("databaseConnection", new PgPromiseAdapter());
    Registry.getInstance().register("book", new Book("BTC-USD"));
    Registry.getInstance().register("orderGateway", new OrderGatewayHttp());
    new BookController();
    httpServer.listen(3002);
}

main();
