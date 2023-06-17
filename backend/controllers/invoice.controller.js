const Invoice = require("../models/invoice.model.js");

// Create and Save a new Invoice
exports.create = (req, res) => {};

// Retrieve all Invoices from the database (with condition).
exports.findAll = (req, res) => {};

// Find a single Invoice with a id
exports.findOne = (req, res) => {};

// Update a Invoice identified by the id in the request
exports.update = (req, res) => {};

// Delete a Invoice with the specified id in the request
exports.delete = (req, res) => {};

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a Invoice
  const invoice = new Invoice({
    createDate: req.body.createDate,
    amount: req.body.amount,
    advancePayment: req.body.advancePayment,
    buyerName: req.body.buyerName,
    invoiceItems: req.body.invoiceItems,
    user: req.body.user,
  });

  // Save Invoice in the database
  Invoice.create(invoice, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Invoice.",
      });
    else res.send(data);
  });
};

// Retrieve all Invoices from the database (with condition).
exports.findAll = (req, res) => {
  Invoice.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving invoices.",
      });
    else res.send(data);
  });
};

exports.findOne = (req, res) => {
  Invoice.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Invoice with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Invoice with id " + req.params.id,
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

  Invoice.updateById(new Invoice(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Invoice with id ${req.body.oid}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Invoice with id " + req.body.oid,
        });
      }
    } else res.send(data);
  });
};

exports.delete = (req, res) => {
  Invoice.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Invoice with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Invoice with id " + req.params.id,
        });
      }
    } else res.send({ message: `Invoice was deleted successfully!` });
  });
};
