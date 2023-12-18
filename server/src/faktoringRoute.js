const express = require("express");
const path = require("path");
const router = express.Router();

// Replace 'path-to-your-angular-app' !!!!!!!!!!!!!!!!!!!!!!!!!!!!
router.use('/faktoring', express.static(path.join(__dirname, 'path-to-your-angular-app')));

module.exports = router;
