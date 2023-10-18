const { pool } = require("../lib/postgres");
const { uploadImage, deleteImage } = require("../services/upload");

const registerProduct = async (req, res) => {
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
  const { mimetype, originalname, buffer } = req.file || {
    mimetype: null,
    originalname: null,
    buffer: null,
  };

  try {
    const params = [descricao, quantidade_estoque, valor, categoria_id];
    const createProduct = await pool.query(
      `
                INSERT INTO produtos
                (descricao, quantidade_estoque, valor, categoria_id)
                VALUES
                ($1, $2, $3, $4)
                RETURNING *`,
      params
    );

    if (originalname) {
      const { id } = createProduct.rows[0];

      const image = await uploadImage(
        `produtos/${id}/${originalname}`,
        buffer,
        mimetype
      );

      const productWithImage = await pool.query(
        `UPDATE produtos SET produto_imagem = $1 returning descricao, quantidade_estoque, valor, categoria_id, produto_imagem`,
        [image.url]
      );

      return res.status(201).json(productWithImage.rows[0]);
    }

    delete createProduct.rows[0].id;

    return res.status(201).json(createProduct.rows[0]);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno no servidor." });
  }
};

const listProducts = async (req, res) => {
  const { categoria_id } = req.query;

  try {
    const validatingCategory = await pool.query(
      `select * from categorias where id = $1`,
      [categoria_id]
    );
    if (categoria_id && validatingCategory.rowCount > 0) {
      const productsFound = await pool.query(
        `select * from produtos where categoria_id = $1`,
        [categoria_id]
      );
      return res.status(200).json(productsFound.rows);
    }
    if (categoria_id && validatingCategory.rowCount === 0) {
      return res.status(404).json({
        mensagem: "Não existe a categoria_id informada.",
      });
    }
    const productsFound = await pool.query(`select * from produtos`);
    return res.status(200).json(productsFound.rows);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno no servidor." });
  }
};

const detailProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const productFound = await pool.query(
      `select * from produtos where id = $1`,
      [id]
    );
    if (productFound.rowCount === 0) {
      return res.status(404).json({
        mensagem: "Não existe o id do produto informado.",
      });
    }
    return res.status(200).json(productFound.rows);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno no servidor." });
  }
};

const updateProduct = async (req, res) => {
  const { id: product_id } = req.params;
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
  const { mimetype, originalname, buffer } = req.file || {
    mimetype: null,
    originalname: null,
    buffer: null,
  };

  try {
    let product = await pool.query("select * from produtos where id = $1", [
      product_id,
    ]);

    if (product.rowCount === 0) {
      return res
        .status(404)
        .json({ mensagem: "O Produto informado não foi encontrado" });
    }

    const imageUrl = product.rows[0].produto_imagem;

    if (imageUrl) {
      const lastSlashIndex = imageUrl.lastIndexOf("/");
      const fileName = imageUrl.substring(lastSlashIndex + 1);

      await deleteImage(`produtos/${product_id}/${fileName}`);
    }

    if (originalname) {
      const image = await uploadImage(
        `produtos/${product_id}/${originalname}`,
        buffer,
        mimetype
      );

      const productWithImage = await pool.query(
        "UPDATE produtos SET descricao = $1, quantidade_estoque = $2, valor = $3, categoria_id = $4, produto_imagem = $5 where id = $6 returning descricao, quantidade_estoque, valor, categoria_id, produto_imagem",
        [
          descricao,
          quantidade_estoque,
          valor,
          categoria_id,
          image.url,
          product_id,
        ]
      );

      return res.status(200).json(productWithImage.rows[0]);
    }

    product = await pool.query(
      "update produtos set descricao = $1, quantidade_estoque = $2, valor = $3, categoria_id = $4, produto_imagem = $5 where id = $6 returning descricao, quantidade_estoque, valor, categoria_id, produto_imagem",
      [descricao, quantidade_estoque, valor, categoria_id, null, product_id]
    );

    return res.status(200).send(product.rows[0]);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const deleteProduct = async (req, res) => {
  const { id: product_id } = req.params;

  try {
    const product = await pool.query("select * from produtos where id = $1", [
      product_id,
    ]);

    const registeredOrder = await pool.query(
      "select pedido_id from pedido_produtos where produto_id = $1",
      [product_id]
    );

    if (product.rowCount === 0) {
      return res
        .status(404)
        .json({ mensagem: "O produto informado não foi encontrado." });
    }

    if (registeredOrder.rowCount > 0) {
      return res.status(403).json({
        mensagem:
          "Não é possível excluir o produto, pois ele se encontra vinculado aos pedidos abaixo.",
        Pedidos: registeredOrder.rows,
      });
    }

    const imageUrl = product.rows[0].produto_imagem;

    if (imageUrl) {
      const lastSlashIndex = imageUrl.lastIndexOf("/");
      const fileName = imageUrl.substring(lastSlashIndex + 1);

      await deleteImage(`produtos/${product_id}/${fileName}`, true);
    }

    await pool.query("delete from produtos where id = $1", [product_id]);

    return res.status(204).send();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

module.exports = {
  registerProduct,
  updateProduct,
  deleteProduct,
  listProducts,
  detailProduct,
};
