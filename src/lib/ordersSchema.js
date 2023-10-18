const joi = require("joi");

const registerOrderSchema = joi.object({
  cliente_id: joi.number().required().messages({
    "any.required": "O campo cliente_id é obrigatório.",
    "number.base": "O campo categoria_id precisa ser do tipo número.",
  }),
  observacao: joi.string().required().messages({
    "any.required": "O campo observacao é obrigatório.",
    "string.base": "O campo observacao precisa ser do tipo texto.",
  }),
  pedido_produtos: joi
    .array()
    .required()
    .messages({
      "any.required": "O campo pedido_produtos é obrigatorio.",
    })
    .items(
      joi.object({
        produto_id: joi.number().required().min(1).messages({
          "any.required": "O campo produto_id é obrigatório.",
          "number.base": "O campo produto_id precisa ser do tipo número.",
          "number.min": "O campo produto_id precisa ter um valor minimo de 1.",
        }),
        quantidade_produto: joi.number().required().min(1).messages({
          "any.required": "O campo quantidade_produto é obrigatório.",
          "number.min": "O campo quantidade_produto não pode ser zero.",
          "number.base":
            "O campo quantidade_produto precisa ser do tipo número.",
        }),
      })
    ),
});

module.exports = {
  registerOrderSchema,
};
