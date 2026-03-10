import { CieloPaymentGateway, PJBankPaymentGateway } from "../gateway/PaymentGateway";
import Retry from "./Retry";

export default interface PaymentProcessor {
    next?: PaymentProcessor;
    processPayment (input: any): Promise<any>;
}

export class CieloPaymentProcessor implements PaymentProcessor {

    constructor (readonly next?: PaymentProcessor) {
    }

    async processPayment(input: any): Promise<any> {
        try {
            const cieloPaymentGateway = new CieloPaymentGateway();
            let output;
            await Retry.execute(async () => {
                output = await cieloPaymentGateway.processTransaction(input);
            }, 3, 1000);
            if (!output) throw new Error();
            return output;
        } catch (_: any) {
            if (!this.next) throw new Error("No processor");
            return await this.next.processPayment(input);
        }
        
    }
}

export class PJBankPaymentProcessor implements PaymentProcessor {

    constructor (readonly next?: PaymentProcessor) {
    }

    async processPayment(input: any): Promise<any> {
        try {
            const pjbankPaymentGateway = new PJBankPaymentGateway();
            const output = await pjbankPaymentGateway.processTransaction(input);
            return output;
        } catch (_: any) {
            if (!this.next) throw new Error("No processor");
            return await this.next.processPayment(input);
        }
        
    }
}
