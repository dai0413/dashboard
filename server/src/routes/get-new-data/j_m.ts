import express from "express";
const router = express.Router();

import { API_PATHS } from "@dai0413/myorg-shared";
import {
  getValues,
  getMatch,
  getPlayerAppearance,
  getPlayerMatchEventLog,
  getRefereeAppearance,
  getStaffAppearance,
} from "../../controllers/get-new-data/j_m/index.js";

router.route(API_PATHS.GET_NEW_DATA.J_M.VALUES).post(getValues);
router.route(API_PATHS.GET_NEW_DATA.J_M.MATCH).post(getMatch);
router
  .route(API_PATHS.GET_NEW_DATA.J_M.PLAYER_APPEARANCE)
  .post(getPlayerAppearance);
router
  .route(API_PATHS.GET_NEW_DATA.J_M.PLAYER_MATCH_EVENT_LOG)
  .post(getPlayerMatchEventLog);
router
  .route(API_PATHS.GET_NEW_DATA.J_M.REFEREE_APPEARANCE)
  .post(getRefereeAppearance);
router
  .route(API_PATHS.GET_NEW_DATA.J_M.STAFF_APPEARANCE)
  .post(getStaffAppearance);

export default router;
