# Sistema de Ponto de Venda (PDV)
Este é um sistema de Ponto de Venda (PDV) baseado em Node.js e Express que permite a gestão de produtos, clientes, pedidos, categorias e usuários. Este README fornecerá uma visão geral do sistema e instruções básicas para executá-lo.

## Funcionalidades
- **Cadastro de Produtos**: Os usuários podem cadastrar produtos com informações como descrição, quantidade em estoque, valor e categoria.
- **Listagem de Produtos:** É possível listar todos os produtos ou filtrá-los por categoria.
- **Detalhes do Produto:** Os detalhes de um produto específico podem ser visualizados.
- **Atualização de Produtos:** Os usuários podem atualizar informações de produtos existentes, incluindo a adição ou atualização de imagens.
- **Exclusão de Produtos:** Produtos podem ser excluídos do sistema.
- **Cadastro de Clientes:** É possível cadastrar clientes com informações como nome, email, CPF e detalhes de endereço.
- **Listagem de Clientes:** Todos os clientes ou clientes específicos podem ser listados.
- **Atualização de Clientes:** Informações de clientes podem ser atualizadas.
- **Cadastro de Pedidos:** Pedidos podem ser registrados com informações do cliente, observações e produtos associados.
- **Listagem de Pedidos:** Todos os pedidos ou pedidos de clientes específicos podem ser listados.
- **Autenticação de Usuários:** Os usuários podem se autenticar no sistema para acessar as funcionalidades protegidas.

## Pré-Requesitos
- Node.js
- PostgreSQL (com as tabelas necessárias conforme fornecidas no arquivo `dump.sql`)
- Variáveis de ambiente configuradas (ver arquivo `.env.example`)

## Instalação
1. Clone este repositório.
2. Instale as dependências com o seguinte comando:
```
npm install
```
3. Renomeie o arquivo .env.example para .env e preencha as variáveis de ambiente com as informações corretas.
4. Execute o servidor com o seguinte comando:
```
npm start
```
5. O sistema estará disponível em **http://localhost:3000** por padrão. Você pode ajustar a porta no arquivo .env.

## Uso
Recomendo o uso do insomnia para poder usar todas as rotas, porem também tem o link do deploy na aplicação para você pode utilizar e substituir o **localhost:3000** para **https://grupo12.cyclic.cloud/** 

### Exemplo de Uso
#### Cadastro
Para se cadastrar no sistema você deve utilizar a rota `post /usuario`, para ter acesso basta você inserir desta maneira no seu insomnia ou qualquer outro software com a mesma funcionalidade:
- **localhost:3000/usuario** Ou **https://grupo12.cyclic.cloud/usuario**
- e passar as seguintes informacoes no corpo da requisição JSON

**Exemplo:**

```javascript
// Corpo da requisição para cadastro de usuário (body)
{
    "nome": "José",
    "email": "jose@email.com",
    "senha": "jose"
}
```

#### Login
Para efetuar o login no sistema você deverá utilizar a rota  `POST` `/login`

```javascript
// Corpo da requisição para efetuar login (body)
{
    "email": "jose@email.com",
    "senha": "jose"
}
```

## ATENÇÃO APOS EFETUAR O LOGIN O SISTEMA IRA RETORNAR UM TOKEN DE ACESSO PARA VOCÊ PODER UTILIZAR TODAS AS OUTRAS FUNCIONALIDADES DO SISTEMA SEM O TOKEN DE ACESSO VOCÊ NÃO TERÁ PERMISSÃO

## Segurança 
O sistema utiliza JWT para autenticar os usuários, protegendo as rotas e garantindo que apenas usuários autenticados tenham acesso a funcionalidades protegidas.

As senhas dos usuários são armazenadas no banco de dados de forma criptografada usando o Bcrypt.

## Implantação
Este sistema está implantado e disponível no seguinte link: **https://grupo12.cyclic.cloud/**.
