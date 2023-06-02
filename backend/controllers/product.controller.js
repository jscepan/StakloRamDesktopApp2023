const Product = require("../models/product.model.js");

// Create and Save a new Product
exports.create = (req, res) => {};

// Retrieve all Products from the database (with condition).
exports.findAll = (req, res) => {};

// Find a single Product with a id
exports.findOne = (req, res) => {};

// Update a Product identified by the id in the request
exports.update = (req, res) => {};

// Delete a Product with the specified id in the request
exports.delete = (req, res) => {};

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a Product
  const product = new Product({
    oid: req.body.oid,
    name: req.body.name,
    uom: req.body.uom,
    pricePerUom: req.body.pricePerUom,
    cashRegisterNumber: req.body.cashRegisterNumber,
  });

  // Save Product in the database
  Product.create(req.params.domain, product, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Product.",
      });
    else res.send(data);
  });
};

// Retrieve all Products from the database (with condition).
exports.findAll = (req, res) => {
  Product.getAll(req.params.domain, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving products.",
      });
    else res.send(data);
  });
};

exports.findOne = (req, res) => {
  Product.findById(req.params.domain, req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Product with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Product with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  Product.updateById(
    req.params.domain,
    req.params.id,
    new Product(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Product with id ${req.params.id}.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating Product with id " + req.params.id,
          });
        }
      } else res.send(data);
    }
  );
};

exports.delete = (req, res) => {
  Product.remove(req.params.domain, req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Product with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Product with id " + req.params.id,
        });
      }
    } else res.send({ message: `Product was deleted successfully!` });
  });
};
