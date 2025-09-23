const express = require("express");
const router = express.Router();

const {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  downloadItem,
} = require("../controllers/models/team");

router.route("/").get(getAllItems).post(createItem);
router.route("/download").get(downloadItem);
router.route("/:id").patch(updateItem).delete(deleteItem).get(getItem);

module.exports = router;
