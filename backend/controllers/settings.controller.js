const fs = require("fs");
// const { app } = require("electron");

// Find a single Settings with a id
exports.find = (req, res) => {};

// Update a Settings identified by the id in the request
exports.update = (req, res) => {};

const path = require("path");

const Setting = function (settings) {
  this.thousandsNumberSign = settings.thousandsNumberSign;
  this.decimalNumberSign = settings.decimalNumberSign;
  this.dateFormat = settings.dateFormat;
  this.currencyFormat = settings.currencyFormat;
  this.currencyDisplayValue = settings.currencyDisplayValue;
  this.qrCodeSizeInPixel = settings.qrCodeSizeInPixel;
  this.qrCodeErrorCorrectionLevel = settings.qrCodeErrorCorrectionLevel;
  this.language = settings.language;
  this.minGlassSurface = settings.minGlassSurface;
  this.copies = settings.copies;
  this.footer = settings.footer;
  this.header = settings.header;
  this.printer = settings.printer;
};

exports.find = (req, res) => {
  const filePath = path.join(__dirname, "../config/settings.json");

  res.send(new Setting(JSON.parse(fs.readFileSync(filePath))));
};

exports.update = (req, res) => {
  const filePath = path.join(__dirname, "../config/settings.json");
  fs.writeFileSync(filePath, JSON.stringify(req.body));
  res.send(req.body);
};
