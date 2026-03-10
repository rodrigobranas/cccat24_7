import GetAccount from "./application/query/GetAccount";
import Signup from "./application/usecase/Signup";
import AccountController from "./infra/controller/AccountController";
import { AccountDAODatabase } from "./infra/dao/AccountDAO";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import Registry from "./infra/di/Registry";
import { ExpressAdapter } from "./infra/http/HttpServer";
import Mediator from "./infra/mediator/Mediator";
import { AccountRepositoryDatabase } from "./infra/repository/AccountRepository";

async function main () {
    const httpServer = new ExpressAdapter();
    Registry.getInstance().register("httpServer", httpServer);
    Registry.getInstance().register("mediator", new Mediator());
    Registry.getInstance().register("databaseConnection", new PgPromiseAdapter());
    Registry.getInstance().register("accountRepository", new AccountRepositoryDatabase());
    Registry.getInstance().register("accountDAO", new AccountDAODatabase());
    Registry.getInstance().register("signup", new Signup());
    Registry.getInstance().register("getAccount", new GetAccount());
    new AccountController();
    httpServer.listen(3000);
}

main();
