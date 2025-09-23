const express = require("express");
const router = express.Router();

const {
  getAllItems,
  createItem,
  checkItem,
  getItem,
  updateItem,
  deleteItem,
  uploadItem,
  downloadItem,
} = require("../controllers/models/player");

const upload = require("../middleware/upload");
const detectEncoding = require("../middleware/detectEncoding");
const checkFileExists = require("../middleware/checkFileExists");

router.route("/").get(getAllItems).post(createItem);
router.route("/check").post(checkItem);
router
  .route("/upload")
  .post(upload.single("file"), checkFileExists, detectEncoding, uploadItem);
router.route("/download").get(downloadItem);
router.route("/:id").patch(updateItem).delete(deleteItem).get(getItem);

module.exports = router;
