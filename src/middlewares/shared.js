const { pool } = require("../lib/postgres");
const { getUserDataByEmail } = require("../utils/index");

const validateBodyRequest = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }

  next();
};

const checkIfEmailIsUnique =
  ({ table }) =>
  async (req, res, next) => {
    const { email } = req.body;

    try {
      const existingEmail = await getUserDataByEmail({
        email,
        table,
      });

      if (existingEmail) {
        return res
          .status(400)
          .json({ mensagem: "O E-Mail já está cadastrado." });
      }
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }

    next();
  };

const checkIfCpfIsUnique = async (req, res, next) => {
  const { cpf } = req.body;

  try {
    const existingCpf = await pool.query(
      "SELECT * FROM clientes WHERE cpf = $1",
      [cpf]
    );

    if (existingCpf.rowCount > 0) {
      return res.status(400).json({ mensagem: "O cpf já está cadastrado." });
    }
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }

  next();
};

module.exports = {
  checkIfEmailIsUnique,
  checkIfCpfIsUnique,
  validateBodyRequest,
};
