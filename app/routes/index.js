module.exports = app => {

  const router = require("express").Router();
  const wallet = require("../controllers/wallet");
  const products = require("../controllers/products");

  router.post("/wallet", wallet.create);
  router.get("/wallet/:id", wallet.detail);
  router.get("/wallet/:id/transaction", wallet.addCredit);
  router.get("/wallet/:id/purchase", wallet.purchase);
  router.get("/wallet/:id/transactions", wallet.listTxn);
  router.get("/products", products.list);

  app.use("/", router);
};
