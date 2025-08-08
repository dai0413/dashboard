const express = require("express");
const router = express.Router();

const {
  getAllNationalCallUp,
  createNationalCallUp,
  getNationalCallUp,
  updateNationalCallUp,
  deleteNationalCallUp,
} = require("../controllers/national-callup");

router.route("/").get(getAllNationalCallUp).post(createNationalCallUp);
router
  .route("/:id")
  .patch(updateNationalCallUp)
  .delete(deleteNationalCallUp)
  .get(getNationalCallUp);

module.exports = router;
