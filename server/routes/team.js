const express = require("express");
const router = express.Router();

const { getAllTeams } = require("../controllers/team");

router.route("/").get(getAllTeams);

module.exports = router;
