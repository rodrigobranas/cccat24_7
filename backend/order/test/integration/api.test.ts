import axios from "axios";
import UUID from "../../src/domain/UUID";

axios.defaults.validateStatus = () => true;

function sleep (time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}

test("Deve criar uma ordem de compra e uma ordem de venda em uma conta", async () => {
    const marketId = `BTC-USD-${Math.random()}`;
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    const outputSignup = responseSignup.data;
    await axios.post("http://localhost:3001/deposit", {
        accountId: outputSignup.accountId,
        assetId: "BTC",
        quantity: 2
    });
    await axios.post("http://localhost:3001/deposit", {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 200000
    });
    const orderId1 = UUID.create().getValue();
    const outputPlaceOrder1 = (await axios.post("http://localhost:3003/place_order", {
        orderId: orderId1,
        accountId: outputSignup.accountId,
        marketId,
        side: "sell",
        quantity: 1,
        price: 78000
    })).data;
    await sleep(400);
    const orderId2 = UUID.create().getValue();
    const outputPlaceOrder2 = (await axios.post("http://localhost:3003/place_order", {
        orderId: orderId2,
        accountId: outputSignup.accountId,
        marketId,
        side: "sell",
        quantity: 1,
        price: 79000
    })).data;
    await sleep(400);
    const orderId3 = UUID.create().getValue();
    const outputPlaceOrder3 = (await axios.post("http://localhost:3003/place_order", {
        orderId: orderId3,
        accountId: outputSignup.accountId,
        marketId,
        side: "buy",
        quantity: 2,
        price: 80000
    })).data;
    await sleep(2000);
    const outputGetOrder1 = (await axios.get(`http://localhost:3001/orders/${orderId1}`)).data;
    expect(outputGetOrder1.name).toBe("John Doe");
    expect(outputGetOrder1.email).toBe("john.doe@gmail.com");
    expect(outputGetOrder1.fillQuantity).toBe(1);
    expect(outputGetOrder1.fillPrice).toBe(78000);
    expect(outputGetOrder1.status).toBe("closed");
    const outputGetOrder2 = (await axios.get(`http://localhost:3001/orders/${orderId2}`)).data;
    expect(outputGetOrder2.fillQuantity).toBe(1);
    expect(outputGetOrder2.fillPrice).toBe(79000);
    expect(outputGetOrder2.status).toBe("closed");
    const outputGetOrder3 = (await axios.get(`http://localhost:3001/orders/${orderId3}`)).data;
    expect(outputGetOrder3.fillQuantity).toBe(2);
    expect(outputGetOrder3.fillPrice).toBe(78500);
    expect(outputGetOrder3.status).toBe("closed");
}, 20000);
