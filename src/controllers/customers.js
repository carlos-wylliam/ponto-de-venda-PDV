const { pool } = require("../lib/postgres");
const { getUserDataByEmail } = require("../utils/index");

const createCustomer = async (req, res) => {
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
    req.body;

  try {
    const client = await pool.query(
      "INSERT INTO clientes(nome, email, cpf, cep, rua, numero, bairro, cidade, estado) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) returning nome, email, cpf, cep, rua, numero, bairro, cidade, estado",
      [nome, email, cpf, cep, rua, numero, bairro, cidade, estado]
    );

    return res.status(201).json(client.rows[0]);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const listCustomers = async (req, res) => {
  try {
    const customers = await pool.query("SELECT * FROM clientes");

    return res.status(200).json(customers.rows);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const listCustomerById = async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await pool.query("SELECT * FROM clientes WHERE id = $1", [
      id,
    ]);

    if (customer.rowCount < 1) {
      return res.status(404).json({ mensagem: "Cliente não encontrado." });
    }

    return res.status(200).json(customer.rows[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor. " });
  }
};

const updateCustomer = async (req, res) => {
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
    req.body;

  const { id } = req.params;

  try {
    const client = await pool.query("SELECT * FROM clientes where id = $1", [
      id,
    ]);

    if (client.rowCount === 0) {
      return res.status(404).json({ mensagem: "Cliente não encontrado." });
    }

    const existingEmail = await getUserDataByEmail({
      email,
      table: "clientes",
    });

    if (existingEmail) {
      const anotherUserEmail = existingEmail.id !== id;

      if (anotherUserEmail) {
        return res.status(409).json({
          mensagem: "Já existe um usuário cadastrado com o e-mail informado.",
        });
      }
    }

    await pool.query(
      `UPDATE clientes SET nome = $1, email = $2, cpf = $3, cep = $5, rua = $5, numero = $6, bairro = $7, cidade = $8, estado = $9 WHERE id = $4`,
      [nome, email, cpf, cep, rua, numero, bairro, cidade, estado]
    );

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

module.exports = {
  listCustomers,
  listCustomerById,
  createCustomer,
  updateCustomer,
};
