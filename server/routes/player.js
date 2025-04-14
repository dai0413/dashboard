const express = require("express");
const router = express.Router();

const {
  getAllPlayers,
  createPlayer,
  checkSimilarPlayers,
  getPlayer,
  updatePlayer,
  deletePlayer,
} = require("../controllers/player");

router.route("/").get(getAllPlayers).post(createPlayer);
router.route("/check").post(checkSimilarPlayers);
router.route("/:id").patch(updatePlayer).delete(deletePlayer).get(getPlayer);

module.exports = router;
