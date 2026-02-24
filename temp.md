Subdomains (problema, espaço do problema, natureza):

Core:
Recepção de Ordens de Compra e Venda
Order Matching

Suporte:
Depósito
Saque
Tracking de Pagamentos

Genérico:
Gestão de Contas de Usuário (Keycloak)
Recepção de PIX (Pagar.me)
Enviar PIX (Pagar.me)

Bounded Contexts (projetos, espaço da solução):

matching-engine (Book)
order (Deposit, Withdraw, PlaceOrder, GetOrder, Order, Wallet, Balance)
account (Signup, GetAccount, Account, Name, Email, Document, Password)

Porque separar? escalabilidade, distribuição de equipe, separação de complexidade
Porque não separar? acoplamento, complexidade de comunicação, dados

Separar em dois bancos de dados: order, account

comunicação: http ou mensageria (RabbitMQ)
consolidação de dados: CQRS
