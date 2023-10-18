const { pool } = require("../lib/postgres");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUserDataByEmail } = require("../utils/index");

const createUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(senha, 10);

    const params = [nome, email, hashedPassword];

    const createdUser = await pool.query(
      `
            INSERT INTO usuarios
            (nome, email, senha)
            VALUES
            ($1, $2, $3)
            RETURNING id, nome, email
        `,
      params
    );

    return res.status(201).json(createdUser.rows[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const userData = await getUserDataByEmail({ email, table: "usuarios" });

    if (!userData) {
      return res.status(401).json({ mensagem: "E-Mail ou senha incorretos." });
    }

    const checkPass = await bcrypt.compare(senha, userData.senha);

    if (!checkPass) {
      return res.status(401).json({ mensagem: "E-Mail ou senha incorretos." });
    }
    const token = jwt.sign({ id: userData.id }, process.env.JWT_PASSWORD, {
      expiresIn: "8h",
    });

    const { senha: _, ...userConnected } = userData;
    return res.status(200).json({ usuario: userConnected, token });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const updateUser = async (req, res) => {
  const { nome, email, senha } = req.body;
  const { id } = req.user;

  try {
    const existingEmail = await getUserDataByEmail({
      email,
      table: "usuarios",
    });

    if (existingEmail) {
      const anotherUserEmail = existingEmail.id !== id;

      if (anotherUserEmail) {
        return res.status(409).json({
          mensagem: "Já existe um usuário cadastrado com o e-mail informado.",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    await pool.query(
      `UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4`,
      [nome, email, hashedPassword, id]
    );

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const getProfile = async (req, res) => {
  return res.status(200).json(req.user);
};

module.exports = {
  createUser,
  login,
  getProfile,
  updateUser,
};
