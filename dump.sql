DROP TABLE IF EXISTS usuarios CASCADE;

DROP TABLE IF EXISTS categorias CASCADE;

DROP TABLE IF EXISTS produtos CASCADE;

DROP TABLE IF EXISTS clientes CASCADE;

DROP TABLE IF EXISTS pedidos CASCADE;

DROP TABLE IF EXISTS pedido_produtos CASCADE;

CREATE TABLE usuarios(
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  SENHA VARCHAR(255) NOT NULL
);

CREATE TABLE categorias(
  id SERIAL PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL
);

INSERT INTO categorias(descricao) VALUES('Informática'), ('Celulares'), ('Beleza e Perfumaria'), ('Mercado'), ('Livros e Papelaria'), ('Brinquedos'), ('Moda'), ('Bebê'), ('Games');

CREATE TABLE produtos(
  id SERIAL PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  quantidade_estoque INTEGER NOT NULL,
  valor INTEGER,
  categoria_id INTEGER REFERENCES categorias(id),
  produto_imagem VARCHAR(255)
);
 
 CREATE TABLE clientes(
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  cpf VARCHAR(255) UNIQUE NOT NULL,
  cep VARCHAR(255),
  rua VARCHAR(255),
  numero INTEGER,
  bairro VARCHAR(255),
  cidade VARCHAR(255),
  estado VARCHAR(255)
);

CREATE TABLE pedidos(
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER REFERENCES clientes(id),
  observacao VARCHAR(255),
  valor_total INTEGER
);
 
CREATE TABLE pedido_produtos(
  id SERIAL PRIMARY KEY,
  pedido_id INTEGER REFERENCES pedidos(id),
  produto_id INTEGER REFERENCES produtos(id),
  quantidade_produto INTEGER,
  valor_produto INTEGER
);