import express from "express";
const router = express.Router();

import {
  getCurrentPlayersByTeam,
  getCurrentLoanPlayersByTeam,
  getNoNumberByCountry,
  getNoCallUp,
} from "../controllers/aggregate.js";
import { API_PATHS } from "@dai0413/shared";

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

export default router;
