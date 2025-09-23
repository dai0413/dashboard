const express = require("express");
const router = express.Router();

const {
  getAllCountrys,
  createCountry,
  getCountry,
  updateCountry,
  deleteCountry,
} = require("../controllers/models/country");

router.route("/").get(getAllCountrys).post(createCountry);
router.route("/:id").patch(updateCountry).delete(deleteCountry).get(getCountry);

module.exports = router;
