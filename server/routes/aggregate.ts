import express from "express";
const router = express.Router();

import {
  getCurrentPlayersByTeam,
  getCurrentLoanPlayersByTeam,
  getNoNumberByCountry,
  getNoCallUp,
} from "../controllers/aggregate.ts";

router.route("/transfer/current-players/:teamId").get(getCurrentPlayersByTeam);
router
  .route("/transfer/current-loans/:teamId")
  .get(getCurrentLoanPlayersByTeam);
router.route("/transfer/no-number").get(getNoNumberByCountry);
router.route("/national-callup/series-count/:countryId").get(getNoCallUp);

export default router;
