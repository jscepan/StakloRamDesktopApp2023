module.exports = (app) => {
  const frames = require("../controllers/frame.controller.js");

  var router = require("express").Router();

  // Create a new Frame
  router.post("/", frames.create);

  // Retrieve all Frame
  router.get("/", frames.findAll);

  // Retrieve a single Frame with id
  router.get("/:id", frames.findOne);

  // Update a Frame with id
  router.put("/:id", frames.update);

  // Delete a Frame with id
  router.delete("/:id", frames.delete);

  app.use("/frames", router);
};
