module.exports = (app) => {
  const settings = require("../controllers/settings.controller.js");

  var router = require("express").Router();

  // Retrieve Settings
  router.get("/", settings.find);

  // Update a Settings with id
  router.put("/", settings.update);

  app.use("/settings", router);
};
