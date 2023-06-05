module.exports = (app) => {
  const passpartuColors = require("../controllers/passpartuColor.controller.js");

  var router = require("express").Router();

  // Create a new PasspartuColor
  router.post("/", passpartuColors.create);

  // Retrieve all PasspartuColor
  router.get("/", passpartuColors.findAll);

  // Retrieve a single PasspartuColor with id
  router.get("/:id", passpartuColors.findOne);

  // Update a PasspartuColor with id
  router.put("/:id", passpartuColors.update);

  // Delete a PasspartuColor with id
  router.delete("/:id", passpartuColors.delete);

  app.use("/passpartuColor", router);
};
