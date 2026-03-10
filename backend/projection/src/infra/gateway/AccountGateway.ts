import axios from "axios";

axios.defaults.validateStatus = () => true;

export default interface AccountGateway {
    signup (input: InputSignup): Promise<OutputSignup>;
    getAccountById (accountId: string): Promise<OutputGetAccountById>;
}

type InputSignup = {
    name: string,
    email: string,
    document: string,
    password: string
}

type OutputSignup = {
    accountId: string
}

type OutputGetAccountById = {
    accountId: string,
    name: string,
    email: string,
    document: string,
    password: string
}

export class AccountGatewayHttp implements AccountGateway {

    async signup(input: any): Promise<any> {
        const response = await axios.post("http://localhost:3000/signup", input);
        const output = response.data;
        if (response.status === 422) throw new Error(output.message);
        return output;
    }

    async getAccountById(accountId: string): Promise<any> {
        const response = await axios.get(`http://localhost:3000/accounts/${accountId}`);
        const output = response.data;
        if (response.status === 422) throw new Error(output.message);
        return output;
    }

}
