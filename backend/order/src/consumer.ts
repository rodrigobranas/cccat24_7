import amqp from "amqplib";
import Order from "./domain/Order";
import UUID from "./domain/UUID";

async function main () {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertExchange("orderPlaced", "direct", { durable: true });
    await channel.assertQueue("orderPlaced.insertOrderToBook", { durable: true });
    await channel.bindQueue("orderPlaced.insertOrderToBook", "orderPlaced", "");

    channel.consume("orderPlaced.insertOrderToBook", async (message: any) => {
        const input = JSON.parse(message.content.toString());
        console.log(input);
        channel.ack(message);
    });
}

main();
