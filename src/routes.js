const { Router } = require("express");

const multer = require("./lib/multer");

const { createUserSchema, userLoginSchema } = require("./lib/userSchema");
const { createClientSchema } = require("./lib/clientSchema");
const {
  registerProductSchema,
  listProductsSchema,
  detailProductSchema,
} = require("./lib/productSchema");

const { baseUrl } = require("./controllers/baseUrl");
const {
  createUser,
  login,
  getProfile,
  updateUser,
} = require("./controllers/users");

const { listCategories } = require("./controllers/category");
const {
  listCustomers,
  listCustomerById,
  createCustomer,
  updateCustomer,
} = require("./controllers/customers");

const { isUserAuthenticated } = require("./middlewares/user");
const {
  checkIfEmailIsUnique,
  checkIfCpfIsUnique,
  validateBodyRequest,
} = require("./middlewares/shared");

const {
  registerProduct,
  listProducts,
  detailProduct,
  updateProduct,
  deleteProduct,
} = require("./controllers/products");
const { registerOrder } = require("./controllers/orders");
const { registerOrderSchema } = require("./lib/ordersSchema");

const { listOrders } = require("./controllers/orders");

const router = Router();

router.get("/", baseUrl);

router.get("/categoria", listCategories);

router.post(
  "/usuario",
  [
    validateBodyRequest(createUserSchema),
    checkIfEmailIsUnique({ table: "usuarios" }),
  ],
  createUser
);

router.post("/login", [validateBodyRequest(userLoginSchema)], login);

router.use(isUserAuthenticated);

router.get("/usuario", getProfile);

router.put("/usuario", [validateBodyRequest(createUserSchema)], updateUser);

router.get("/cliente", listCustomers);

router.get("/cliente/:id", listCustomerById);

router.post(
  "/produto",
  [multer.single("produto_imagem"), validateBodyRequest(registerProductSchema)],
  registerProduct
);

router.get("/produto", [validateBodyRequest(listProductsSchema)], listProducts);

router.get(
  "/produto/:id",
  [validateBodyRequest(detailProductSchema)],
  detailProduct
);

router.put(
  "/produto/:id",
  [multer.single("produto_imagem"), validateBodyRequest(registerProductSchema)],
  updateProduct
);

router.delete("/produto/:id", deleteProduct);

router.post(
  "/cliente",
  [
    validateBodyRequest(createClientSchema),
    checkIfEmailIsUnique({ table: "clientes" }),
    checkIfCpfIsUnique,
  ],
  createCustomer
);

router.post(
  "/cliente/:id",
  [
    validateBodyRequest(createClientSchema),
    checkIfEmailIsUnique({ table: "clientes" }),
    checkIfCpfIsUnique,
  ],
  updateCustomer
);

router.get("/pedido", listOrders);

router.post(
  "/pedido",
  [validateBodyRequest(registerOrderSchema)],
  registerOrder
);

module.exports = {
  router,
};
