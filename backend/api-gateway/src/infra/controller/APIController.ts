import { inject } from "../di/Registry";
import HttpServer from "../http/HttpServer";
import Queue from "../queue/Queue";

export default class BookController {
    @inject("httpServer")
    httpServer!: HttpServer;
    @inject("queue")
    queue!: Queue;

    constructor () {

        this.httpServer.route("post", "/place_order", async (params: any, body: any) => {
            console.log("placeOrder");
            await this.queue.publish("placeOrder", body);
        });
    }
}