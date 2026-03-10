import Book from "../../src/domain/Book";
import Order from "../../src/domain/Order";
import UUID from "../../src/domain/UUID";

function sleep (time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}

test("Deve testar o livro de ofertas", async () => {
    const accountId = UUID.create().getValue();
    const marketId = "BTC-USD";
    const book = new Book(marketId);
    book.register("orderFilled", async (event: any) => {
        // console.log(event);
    });
    const order1 = Order.createOrder(accountId, marketId, "sell", 1, 78000);
    await book.insert(order1);
    await sleep(100);
    const order2 = Order.createOrder(accountId, marketId, "sell", 1, 79000);
    await book.insert(order2);
    await sleep(100);
    const order3 = Order.createOrder(accountId, marketId, "buy", 2, 80000);
    await book.insert(order3);
    await sleep(100);
});