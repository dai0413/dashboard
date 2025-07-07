const express = require("express");
const router = express.Router();

const { getTopPageData } = require("../controllers/top");

router.route("/").get(getTopPageData);

module.exports = router;
