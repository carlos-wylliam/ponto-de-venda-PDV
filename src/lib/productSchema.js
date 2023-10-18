const joi = require("joi");

const registerProductSchema = joi.object({
  descricao: joi.string().min(1).required().messages({
    "any.required": "O campo descrição é obrigatório.",
    "string.min": "O campo descrição precisa ter no mínimo 1 caractere.",
    "string.empty": "O campo descrição não pode ser vazio.",
  }),
  quantidade_estoque: joi.number().required().min(1).messages({
    "any.required": "O campo quantidade_estoque é obrigatório.",
    "number.min":
      "O campo quantidade_estoque precisa ter no mínimo 1 item em estoque.",
    "number.empty": "O campo quantidade_estoque não pode ser vazio.",
    "number.base": "O campo quantidade_estoque tem que ser do tipo número.",
  }),
  valor: joi.number().required().min(1).messages({
    "any.required": "O campo valor é obrigatório.",
    "number.min": "O campo valor precisa ter um valor minimo de 1.",
    "number.empty": "O campo valor não pode ser vazio.",
    "number.base": "O campo valor tem que ser do tipo número.",
  }),
  categoria_id: joi.number().required().min(1).messages({
    "any.required": "O campo categoria_id é obrigatório.",
    "number.min": "O campo categoria_id precisa ter um valor minimo de 1.",
    "number.empty": "O campo categoria_id não pode ser vazio.",
    "number.base": "O campo categoria_id tem que ser do tipo número.",
  }),
});

const listProductsSchema = joi.object({
  categoria_id: joi.number().min(1).messages({
    "number.min": "O campo categoria_id precisa ter um valor mínimo de 1.",
    "number.base": "O campo categoria_id tem que ser do tipo número.",
  }),
});

const detailProductSchema = joi.object({
  id: joi.number().min(1).messages({
    "number.min": "O campo id precisa ter um valor mínimo de 1.",
    "number.base": "O campo id tem que ser do tipo número.",
  }),
});
module.exports = {
  registerProductSchema,
  listProductsSchema,
  detailProductSchema,
};
