const express = require("express");
const router = express.Router();

const {
  getAllNationalMatchSeries,
  createNationalMatchSeries,
  getNationalMatchSeries,
  updateNationalMatchSeries,
  deleteNationalMatchSeries,
  downloadItems,
} = require("../controllers/national-match-series");

router
  .route("/")
  .get(getAllNationalMatchSeries)
  .post(createNationalMatchSeries);
router.route("/download").get(downloadItems);
router
  .route("/:id")
  .patch(updateNationalMatchSeries)
  .delete(deleteNationalMatchSeries)
  .get(getNationalMatchSeries);

module.exports = router;
