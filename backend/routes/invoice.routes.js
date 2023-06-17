module.exports = (app) => {
  const invoices = require("../controllers/invoice.controller.js");

  var router = require("express").Router();

  // Create a new Invoice
  router.post("/", invoices.create);

  // Retrieve all Invoice
  router.get("/", invoices.findAll);

  // Retrieve a single Invoice with id
  router.get("/:id", invoices.findOne);

  // Update a Invoice with id
  router.put("/", invoices.update);

  // Delete a Invoice with id
  router.delete("/:id", invoices.delete);

  app.use("/invoices", router);
};
