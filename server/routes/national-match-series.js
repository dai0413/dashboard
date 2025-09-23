const express = require("express");
const router = express.Router();

const {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  downloadItems,
} = require("../controllers/models/national-match-series");

router.route("/").get(getAllItems).post(createItem);
router.route("/download").get(downloadItems);
router.route("/:id").patch(updateItem).delete(deleteItem).get(getItem);

module.exports = router;
