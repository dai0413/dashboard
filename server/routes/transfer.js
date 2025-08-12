const express = require("express");
const router = express.Router();

const {
  getAllTransfer,
  createTransfer,
  getTransfer,
  updateTransfer,
  deleteTransfer,
  getCurrentPlayersByTeam,
  getCurrentLoanPlayersByTeam,
  getNoNumberByCountry,
} = require("../controllers/transfer");

router.route("/").get(getAllTransfer).post(createTransfer);
router
  .route("/:id")
  .patch(updateTransfer)
  .delete(deleteTransfer)
  .get(getTransfer);
router.route("/current-players/:teamId").get(getCurrentPlayersByTeam);
router.route("/current-loans/:teamId").get(getCurrentLoanPlayersByTeam);
router.route("/no-number/:countryId").get(getNoNumberByCountry);

module.exports = router;
