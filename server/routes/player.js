const express = require("express");
const router = express.Router();

const {
  getAllPlayers,
  createPlayer,
  checkSimilarPlayers,
  getPlayer,
  updatePlayer,
  deletePlayer,
  uploadPlayer,
  downloadPlayer,
} = require("../controllers/models/player");

const upload = require("../middleware/upload");
const detectEncoding = require("../middleware/detectEncoding");
const checkFileExists = require("../middleware/checkFileExists");

router.route("/").get(getAllPlayers).post(createPlayer);
router.route("/check").post(checkSimilarPlayers);
router
  .route("/upload")
  .post(upload.single("file"), checkFileExists, detectEncoding, uploadPlayer);
router.route("/download").get(downloadPlayer);
router.route("/:id").patch(updatePlayer).delete(deletePlayer).get(getPlayer);

module.exports = router;
