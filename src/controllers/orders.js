const { pool } = require("../lib/postgres");

const listOrders = async (req, res) => {
  const { cliente_id } = req.query;

  try {
    if (cliente_id) {
      const orderById = await pool.query(
        `
        SELECT json_build_object(
        'id', p.id,
        'valor_total', p.valor_total,
        'observacao', p.observacao,
        'cliente_id', p.cliente_id
        ) AS pedido,
        
        jsonb_agg(json_build_object(
        'id', pp.id,
        'quantidade_produto', pp.quantidade_produto,
        'valor_produto', pp.valor_produto,
        'pedido_id', pp.pedido_id,
        'produto_id', pp.produto_id
        )) AS pedido_produtos
        FROM pedidos p
        JOIN pedido_produtos pp ON p.id = pp.pedido_id 
        WHERE p.cliente_id = $1
        GROUP BY p.id ORDER BY p.id
        `,
        [cliente_id]
      );

      return res.status(200).json(orderById.rows);
    }
    const orders = await pool.query(`
        SELECT json_build_object(
          'id', p.id,
          'valor_total', p.valor_total,
          'observacao', p.observacao,
          'cliente_id', p.cliente_id
        ) AS pedido,
        
         jsonb_agg(json_build_object(
          'id', pp.id,
          'quantidade_produto', pp.quantidade_produto,
          'valor_produto', pp.valor_produto,
          'pedido_id', pp.pedido_id,
          'produto_id', pp.produto_id
        )) AS pedido_produtos
        FROM pedidos p
        JOIN pedido_produtos pp ON p.id = pp.pedido_id GROUP BY p.id ORDER BY p.id
        `);

    return res.json(orders.rows);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}

const send = require("../services/nodemailer");

const registerOrder = async (req, res) => {
  const { cliente_id, pedido_produtos, observacao } = req.body;

  try {
    const verifyExistClient = await pool.query(
      "select * from clientes where id = $1",
      [cliente_id]
    );

    if (verifyExistClient.rowCount === 0) {
      return res
        .status(404)
        .json({
          mensagem:
            "O id do cliente enviado no corpo da requisição não existe.",
        });
    }

    let valueTotal = 0;
    let quantityProduct = {};

    for (let i = 0; i < pedido_produtos.length; i++) {
      const { produto_id, quantidade_produto } = pedido_produtos[i];

      if (!quantityProduct[produto_id]) {
        quantityProduct[produto_id] = 0;
      }
      quantityProduct[produto_id] += quantidade_produto;

      const verifyExistProduct = await pool.query(
        "select * from produtos where id = $1",
        [produto_id]
      );
      if (verifyExistProduct.rowCount === 0) {
        return res
          .status(404)
          .json({
            mensagem:
              "O produto_id informado no corpo da requisição não existe",
          });
      }

      if (
        quantityProduct[produto_id] >
        verifyExistProduct.rows[0].quantidade_estoque
      ) {
        return res
          .status(400)
          .json({
            mensagem: `A quantidade informada do produto ${produto_id} não está disponível em nosso estoque`,
          });
      }

      const consultProduct = await pool.query(
        "select * from produtos where id = $1",
        [produto_id]
      );

      const product = consultProduct.rows[0];
      const valueUnitary = product.valor;
      valueTotal += valueUnitary * quantidade_produto;
    }

    const orderRegister = await pool.query(
      "insert into pedidos (cliente_id, observacao, valor_total) values ($1, $2, $3)",
      [cliente_id, observacao, valueTotal]
    );

    for (let i = 0; i < pedido_produtos.length; i++) {
      const { produto_id, quantidade_produto } = pedido_produtos[i];

      const consultOrderId = await pool.query(
        "select * from pedidos where cliente_id = $1",
        [cliente_id]
      );
      const orderId = consultOrderId.rows[0].id;

      const consultValueProduct = await pool.query(
        "select * from produtos where id = $1",
        [produto_id]
      );
      const valueProduct = consultValueProduct.rows[0].valor;

      const registerOrderProcuts = await pool.query(
        "insert into pedido_produtos (pedido_id, produto_id, quantidade_produto, valor_produto) values ($1, $2, $3, $4)",
        [orderId, produto_id, quantidade_produto, valueProduct]
      );
    }
    const consultMailUser = await pool.query(
      "select * from clientes where id = $1",
      [cliente_id]
    );
    const to = consultMailUser.rows[0].email;
    const subject = "Pedido efetuado com sucesso.";
    const body = "Seu pedido foi cadastrado e efetuado com sucesso!";
    send(to, subject, body);
    return res.status(201).json({ mensagem: "Pedido cadastrado com sucesso" });
  } catch (error) {
    console.log(error.messages);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

module.exports = {
  listOrders,
  registerOrder,
};
