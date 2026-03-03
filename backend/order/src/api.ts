import Deposit from "./application/usecase/Deposit";
import ExecuteOrder from "./application/usecase/ExecuteOrder";
import GetOrder from "./application/usecase/GetOrder";
import PlaceOrder from "./application/usecase/PlaceOrder";
import Book from "./domain/Book";
import OrderController from "./infra/controller/OrderController";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import Registry from "./infra/di/Registry";
import { AccountGatewayHttp } from "./infra/gateway/AccountGateway";
import { BookGatewayHttp } from "./infra/gateway/BookGateway";
import { ExpressAdapter } from "./infra/http/HttpServer";
import Mediator from "./infra/mediator/Mediator";
import { RabbitMQAdapter } from "./infra/queue/Queue";
import { OrderRepositoryDatabase } from "./infra/repository/OrderRepository";
import { WalletRepositoryDatabase } from "./infra/repository/WalletRepository";

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
    Registry.getInstance().register("walletRepository", new WalletRepositoryDatabase());
    Registry.getInstance().register("orderRepository", new OrderRepositoryDatabase());
    Registry.getInstance().register("accountGateway", new AccountGatewayHttp());
    Registry.getInstance().register("bookGateway", new BookGatewayHttp());
    Registry.getInstance().register("deposit", new Deposit());
    Registry.getInstance().register("placeOrder", new PlaceOrder());
    Registry.getInstance().register("executeOrder", new ExecuteOrder());
    Registry.getInstance().register("getOrder", new GetOrder());
    Registry.getInstance().register("book", new Book("BTC-USD"));
    new OrderController();
    httpServer.listen(3001);
}

main();
