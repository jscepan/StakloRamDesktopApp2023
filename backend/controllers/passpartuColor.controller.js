const PasspartuColor = require("../models/passpartuColor.model.js");

// Create and Save a new PasspartuColor
exports.create = (req, res) => {};

// Retrieve all PasspartuColors from the database (with condition).
exports.findAll = (req, res) => {};

// Find a single PasspartuColor with a id
exports.findOne = (req, res) => {};

// Update a PasspartuColor identified by the id in the request
exports.update = (req, res) => {};

// Delete a PasspartuColor with the specified id in the request
exports.delete = (req, res) => {};

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a PasspartuColor
  const passpartuColor = new PasspartuColor({
    oid: req.body.oid,
    passpartu: req.body.passpartu,
  });

  // Save PasspartuColor in the database
  PasspartuColor.create(passpartuColor, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the PasspartuColor.",
      });
    else res.send(data);
  });
};

// Retrieve all PasspartuColors from the database (with condition).
exports.findAll = (req, res) => {
  PasspartuColor.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving passpartuColors.",
      });
    else res.send(data);
  });
};

exports.findOne = (req, res) => {
  PasspartuColor.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found PasspartuColor with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving PasspartuColor with id " + req.params.id,
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
  PasspartuColor.updateById(
    req.params.id,
    new PasspartuColor(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found PasspartuColor with id ${req.params.id}.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating PasspartuColor with id " + req.params.id,
          });
        }
      } else res.send(data);
    }
  );
};

exports.delete = (req, res) => {
  PasspartuColor.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found PasspartuColor with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete PasspartuColor with id " + req.params.id,
        });
      }
    } else res.send({ message: `PasspartuColor was deleted successfully!` });
  });
};
