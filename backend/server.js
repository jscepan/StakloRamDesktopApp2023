const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:55552",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

/*
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});
*/

// set port, listen for requests
const PORT = process.env.PORT || 45329;
// require("./routes/invoice.routes.js")(app);
require("./routes/product.routes.js")(app);
require("./routes/passpartuColor.routes.js")(app);
require("./routes/frame.routes.js")(app);
require("./routes/user.routes.js")(app);
require("./routes/settings.routes.js")(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
