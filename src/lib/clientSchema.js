const joi = require("joi");

const createClientSchema = joi.object({
  nome: joi
    .string()
    .min(1)
    .required()
    .regex(/^[a-záéíóúâêîôûã][a-záéíóúâêîôûã]*(?: [a-záéíóúâêîôûã]+)*$/i)
    .messages({
      "string.pattern.base":
        "O campo nome precisa ser válido, verifique espaços em branco ou caracteres especiais.",
      "any.required": "O campo nome é obrigatório.",
      "string.empty": "O campo nome não pode ser vazio.",
      "string.min": "O campo nome precisa ter ao menos 1 caractere.",
    }),
  email: joi.string().email().required().messages({
    "string.email": "O campo email precisar ser válido.",
    "any.required": "O campo email é obrigatório.",
    "string.empty": "O campo email não pode ser vazio.",
  }),
  cpf: joi.string().min(11).required().messages({
    "any.required": "O campo cpf é obrigatório.",
    "string.empty": "O campo cpf não pode ser vazio.",
    "string.min": "O campo cpf precisar ter no mínimo 11 caracteres.",
  }),
  cep: joi.string(),
  rua: joi.string(),
  numero: joi.number(),
  bairro: joi.string(),
  cidade: joi.string(),
  estado: joi.string(),
});

module.exports = {
  createClientSchema,
};
