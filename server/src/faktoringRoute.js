const express = require("express");
const path = require("path");
const router = express.Router();

router.use('/', express.static(path.join(__dirname, "../client/browser")));
console.log(path.join(__dirname, "../client/browser"))

module.exports = router;
