const express = require("express");
const cors = require("cors");
const faktoringRoute = require("./faktoringRoute");
const mfgDataRoute = require("./mfgDataRoute");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Integrating the routes from the modules
app.use(faktoringRoute);
app.use(mfgDataRoute);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

module.exports = app;
