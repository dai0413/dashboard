import express from "express";
const router = express.Router();

import {
  getCurrentPlayersByTeam,
  getCurrentLoanPlayersByTeam,
  getNoNumberByCountry,
  getNoCallUp,
  getPlayerStatistics,
} from "../controllers/aggregate/index.js";
import { API_PATHS } from "@dai0413/myorg-shared";

router
  .route(API_PATHS.AGGREGATE.TRANSFER.CURRENT_PLAYERS_BY_TEAM(`:teamId`))
  .get(getCurrentPlayersByTeam);
router
  .route(API_PATHS.AGGREGATE.TRANSFER.CURRENT_LOANS_BY_TEAM(`:teamId`))
  .get(getCurrentLoanPlayersByTeam);
router.route(API_PATHS.AGGREGATE.TRANSFER.NO_NUMBER).get(getNoNumberByCountry);
router
  .route(API_PATHS.AGGREGATE.NATIONAL_CALLUP.SERIES_COUNT(":countryId"))
  .get(getNoCallUp);
router.route(API_PATHS.AGGREGATE.PLAYER.STATISTICS).get(getPlayerStatistics);

export default router;
