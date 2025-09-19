const express = require("express");
const router = express.Router();

const {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  uploadItem,
} = require("../controllers/match");

const upload = require("../middleware/upload");
const detectEncoding = require("../middleware/detectEncoding");
const checkFileExists = require("../middleware/checkFileExists");

router.route("/").get(getAllItems).post(createItem);
router.route("/:id").patch(updateItem).delete(deleteItem).get(getItem);
router
  .route("/upload")
  .post(upload.single("file"), checkFileExists, detectEncoding, uploadItem);

module.exports = router;
