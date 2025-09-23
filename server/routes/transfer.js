const express = require("express");
const router = express.Router();

const {
  getAllTransfer,
  createTransfer,
  getTransfer,
  updateTransfer,
  deleteTransfer,
} = require("../controllers/models/transfer");

router.route("/").get(getAllTransfer).post(createTransfer);
router
  .route("/:id")
  .patch(updateTransfer)
  .delete(deleteTransfer)
  .get(getTransfer);

module.exports = router;
