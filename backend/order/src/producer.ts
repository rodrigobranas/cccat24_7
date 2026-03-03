import amqp from "amqplib";
import Order from "./domain/Order";
import UUID from "./domain/UUID";

async function main () {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertExchange("orderPlaced", "direct", { durable: true });
    await channel.assertQueue("orderPlaced.insertOrderToBook", { durable: true });
    await channel.bindQueue("orderPlaced.insertOrderToBook", "orderPlaced", "");

    const accountId = UUID.create().getValue();
    const order = Order.createOrder(accountId, "BTC-USD", "sell", 1, 78000);
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

    channel.publish("orderPlaced", "", Buffer.from(JSON.stringify(input)));
}

main();
