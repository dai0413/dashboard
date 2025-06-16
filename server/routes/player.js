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
} = require("../controllers/player");

const upload = require("../middleware/upload");
const detectEncoding = require("../middleware/detectEncoding");
const checkFileExists = require("../middleware/checkFileExists");

router.route("/").get(getAllPlayers).post(createPlayer);
router.route("/check").post(checkSimilarPlayers);
router.route("/:id").patch(updatePlayer).delete(deletePlayer).get(getPlayer);
router
  .route("/upload")
  .post(upload.single("file"), checkFileExists, detectEncoding, uploadPlayer);

module.exports = router;
