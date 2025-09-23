const express = require("express");
const router = express.Router();

const {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
} = require("../controllers/models/competition-stage");

router.route("/").get(getAllItems).post(createItem);
router.route("/:id").patch(updateItem).delete(deleteItem).get(getItem);

module.exports = router;
