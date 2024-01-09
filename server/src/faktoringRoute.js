const express = require("express");
const path = require("path");
const router = express.Router();

//if we want all possible URLs to point to the main page we need to use both
//removing the first one completely breaks the app
//removing the second one doesn't load the page when using invalid url
router.use('/', express.static(path.join(__dirname, "../client/browser")));
router.use('*', express.static(path.join(__dirname, "../client/browser")));

module.exports = router;
