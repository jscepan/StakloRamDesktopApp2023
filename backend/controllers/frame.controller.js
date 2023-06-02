const Frame = require("../models/frame.model.js");

// Create and Save a new Frame
exports.create = (req, res) => {};

// Retrieve all Frames from the database (with condition).
exports.findAll = (req, res) => {};

// Find a single Frame with a id
exports.findOne = (req, res) => {};

// Update a Frame identified by the id in the request
exports.update = (req, res) => {};

// Delete a Frame with the specified id in the request
exports.delete = (req, res) => {};

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a Frame
  const frame = new Frame({
    name: req.body.name,
    uom: req.body.uom,
    pricePerUom: req.body.pricePerUom,
    cashRegisterNumber: req.body.cashRegisterNumber,
    code: req.body.code,
    frameWidthMM: req.body.frameWidthMM,
  });

  // Save Frame in the database
  Frame.create(frame, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Frame.",
      });
    else res.send(data);
  });
};

// Retrieve all Frames from the database (with condition).
exports.findAll = (req, res) => {
  Frame.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving frames.",
      });
    else res.send(data);
  });
};

exports.findOne = (req, res) => {
  Frame.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Frame with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Frame with id " + req.params.id,
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

  Frame.updateById(req.params.id, new Frame(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Frame with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Frame with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

exports.delete = (req, res) => {
  Frame.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Frame with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Frame with id " + req.params.id,
        });
      }
    } else res.send({ message: `Frame was deleted successfully!` });
  });
};
