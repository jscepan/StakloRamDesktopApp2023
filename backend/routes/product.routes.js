module.exports = (app) => {
  const products = require("../controllers/product.controller.js");

  var router = require("express").Router();

  // Create a new Product
  router.post("/:domain", products.create);

  // Retrieve all Product
  router.get("/:domain", products.findAll);

  // Retrieve a single Product with id
  router.get("/:domain/:id", products.findOne);

  // Update a Product with id
  router.put("/:domain/:id", products.update);

  // Delete a Product with id
  router.delete("/:domain/:id", products.delete);

  app.use("/products", router);
};
