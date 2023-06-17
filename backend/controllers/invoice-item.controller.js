const InvoiceItem = require("../models/invoice-item.model.js");

// Create and Save a new InvoiceItem
exports.create = (req, res) => {};

// Retrieve all InvoiceItems from the database (with condition).
exports.findAll = (req, res) => {};

// Find a single InvoiceItem with a id
exports.findOne = (req, res) => {};

// Update a InvoiceItem identified by the id in the request
exports.update = (req, res) => {};

// Delete a InvoiceItem with the specified id in the request
exports.delete = (req, res) => {};

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a InvoiceItem
  const invoiceItem = new InvoiceItem({
    title: req.body.title,
    serviceType: req.body.serviceType,
    amount: req.body.amount,
    dimensionsWidth: req.body.dimensionsWidth,
    dimensionsHeight: req.body.dimensionsHeight,
    dimensionsUom: req.body.dimensionsUom,
    dimensionsOutterWidth: req.body.dimensionsOutterWidth,
    dimensionsOutterHeight: req.body.dimensionsOutterHeight,
    selectedFrames: req.body.selectedFrames,
    glass: req.body.glass,
  });

  // Save InvoiceItem in the database
  InvoiceItem.create(invoiceItem, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the InvoiceItem.",
      });
    else res.send(data);
  });
};

// Retrieve all InvoiceItems from the database (with condition).
exports.findAll = (req, res) => {
  InvoiceItem.getAll(req.params.id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving invoiceItems.",
      });
    else res.send(data);
  });
};

exports.findOne = (req, res) => {
  InvoiceItem.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found InvoiceItem with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving InvoiceItem with id " + req.params.id,
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

  InvoiceItem.updateById(
    req.params.id,
    new InvoiceItem(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found InvoiceItem with id ${req.params.id}.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating InvoiceItem with id " + req.params.id,
          });
        }
      } else res.send(data);
    }
  );
};

exports.delete = (req, res) => {
  InvoiceItem.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found InvoiceItem with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete InvoiceItem with id " + req.params.id,
        });
      }
    } else res.send({ message: `InvoiceItem was deleted successfully!` });
  });
};
