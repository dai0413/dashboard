const express = require("express");
const router = express.Router();

const {
  getAllInjury,
  createInjury,
  getInjury,
  updateInjury,
  deleteInjury,
} = require("../controllers/injury");

router.route("/").get(getAllInjury).post(createInjury);
router.route("/:id").patch(updateInjury).delete(deleteInjury).get(getInjury);

module.exports = router;
