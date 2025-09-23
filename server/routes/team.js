const express = require("express");
const router = express.Router();

const {
  getAllTeams,
  createTeam,
  getTeam,
  updateTeam,
  deleteTeam,
  downloadTeam,
} = require("../controllers/models/team");

router.route("/").get(getAllTeams).post(createTeam);
router.route("/download").get(downloadTeam);
router.route("/:id").patch(updateTeam).delete(deleteTeam).get(getTeam);

module.exports = router;
