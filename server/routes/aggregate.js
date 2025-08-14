const express = require("express");
const router = express.Router();

const {
  getCurrentPlayersByTeam,
  getCurrentLoanPlayersByTeam,
  getNoNumberByCountry,
  getNoCallUp,
} = require("../controllers/aggregate");

router.route("/transfer/current-players/:teamId").get(getCurrentPlayersByTeam);
router
  .route("/transfer/current-loans/:teamId")
  .get(getCurrentLoanPlayersByTeam);
router.route("/transfer/no-number/:countryId").get(getNoNumberByCountry);
router.route("/national-callup/series-count/:countryId").get(getNoCallUp);

module.exports = router;
