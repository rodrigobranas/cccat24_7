Signup - Criar Conta

POST /signup
Input: name, email, document, password

* o campo name deve ser composto pelo nome e sobrenome
* email deve ter @ e um domínio como .com ou .com.br
* document deve ser formado somente por números, . e -, sendo que o digito verificador deve ser válido
* password deve ter no mínimo 8 caracteres com letras minúsculas, maiúsculas e números
* deve retornar um JSON contendo o accountId

GetAccount - Obter Conta

GET /accounts/:accountId

* deve retornar 404 caso a conta não exista
* deve retornar 200 caso a conta exista, juntamente com um JSON com accountId, name, email e document

Deposit (Depósito)
Adicionar fundos em uma conta.

Input: accountId, assetId, quantity
Output: void

Regras:

* A conta deve existir
* O assetId permitido é BTC ou USD
* A quantidade deve ser maior que zero








Withdraw (Saque)
Retirar fundos de uma conta.

Input: accountId, assetId, quantity
Output: void

Regras:

A conta deve existir
O assetId permitido é BTC ou USD
A quantidade deve ser maior ou igual ao saldo

create table ccca.account_asset (
	account_id uuid,
	asset_id text,
	quantity numeric,
	primary key (account_id, asset_id)
);