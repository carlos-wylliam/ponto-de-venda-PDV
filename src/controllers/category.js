const { pool } = require("../lib/postgres");

const listCategories = async (req, res) => {
  try {
    const categories = await pool.query("select * from categorias");

    return res.status(200).json(categories.rows);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

module.exports = {
  listCategories,
};
