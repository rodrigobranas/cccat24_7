import amqp from "amqplib";

export default interface Queue {
    connect (): Promise<void>;
    setup (exchange: string, queue: string, type?: string, routingKey?: string): Promise<void>;
    publish (exchange: string, data: any): Promise<void>;
    consume (queue: string, callback: Function): Promise<void>;
}

export class RabbitMQAdapter implements Queue {
    connection!: amqp.ChannelModel;
    channel!: amqp.Channel;

    async connect(): Promise<void> {
        this.connection = await amqp.connect("amqp://localhost");
        this.channel = await this.connection.createChannel();
    }

    async setup(exchange: string, queue: string, type: string = "direct", routingKey: string = ""): Promise<void> {
        await this.channel.assertExchange(exchange, type, { durable: true });
        await this.channel.assertQueue(queue, { durable: true });
        await this.channel.bindQueue(queue, exchange, routingKey);
    }

    async publish(exchange: string, data: any): Promise<void> {
        this.channel.publish(exchange, "", Buffer.from(JSON.stringify(data)));
    }

    async consume(queue: string, callback: Function): Promise<void> {
        await this.channel.consume(queue, async (message: any) => {
            try {
                const input = JSON.parse(message.content.toString());
                await callback(input);
                this.channel.ack(message);
            } catch (e: any) {
                console.error(e);
            }
        });
    }

}