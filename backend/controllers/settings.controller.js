const fs = require("fs");
const { exec } = require("child_process");

// const { app } = require("electron");

// Find a single Settings with a id
exports.find = (req, res) => {};

// Update a Settings identified by the id in the request
exports.update = (req, res) => {};

exports.findPrinters = (req, res) => {};

const path = require("path");

const Setting = function (settings) {
  this.defaultDimensionsWidth = settings.defaultDimensionsWidth;
  this.defaultDimensionsHeight = settings.defaultDimensionsHeight;
  this.minGlassSurface = settings.minGlassSurface;

  this.decimalNumberSign = settings.decimalNumberSign;
  this.dateFormat = settings.dateFormat;
  this.invoicePrintWidth = settings.invoicePrintWidth;
  this.currencyDisplayValue = settings.currencyDisplayValue;
  this.increaseButtonOneValue = settings.increaseButtonOneValue;
  this.increaseButtonTwoValue = settings.increaseButtonTwoValue;
  this.increaseButtonThreeValue = settings.increaseButtonThreeValue;
  this.header = settings.header;
  this.footer = settings.footer;
  this.qrCodeSizeInPixel = settings.qrCodeSizeInPixel;
  this.qrCodeErrorCorrectionLevel = settings.qrCodeErrorCorrectionLevel;

  this.printer = settings.printer;
  this.copies = settings.copies;

  this.language = settings.language;
  this.touchScreenKeyboardEnabled = settings.touchScreenKeyboardEnabled;
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

exports.findPrinters = (req, res) => {
  exec("wmic printer list brief", (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      return;
    }
    // list of printers with brief details
    // console.log(stdout);
    // the *entire* stdout and stderr (buffered)
    stdout = stdout.split("  ");
    var printers = [];
    j = 0;
    stdout = stdout.filter((item) => item);
    for (i = 0; i < stdout.length; i++) {
      if (stdout[i] == " \r\r\n" || stdout[i] == "\r\r\n") {
        printers[j] = stdout[i + 1];
        j++;
      }
    }
    // list of only printers name
    res.send(printers);
  });
};
