module.exports = (app) => {
  const settings = require("../controllers/settings.controller.js");

  var router = require("express").Router();

  // Retrieve Settings
  router.get("/", settings.find);

  // Update a Settings with id
  router.put("/", settings.update);

  router.get("/printers", settings.findPrinters);

  router.put("/printers/default", settings.updatePrinters);

  app.use("/settings", router);
};
