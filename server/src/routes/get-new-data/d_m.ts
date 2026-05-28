import express from "express";
const router = express.Router();

import { API_PATHS } from "@dai0413/myorg-shared";
import {
  getValues,
  getPlayerAppearance,
  getPlayerMatchEventLog,
  getRefereeAppearance,
  getStaffAppearance,
  getStaffMatchEventLog,
} from "../../controllers/get-new-data/d_m/index.js";

router.route(API_PATHS.GET_NEW_DATA.D_M.VALUES).post(getValues);
router
  .route(API_PATHS.GET_NEW_DATA.D_M.PLAYER_APPEARANCE)
  .post(getPlayerAppearance);
router
  .route(API_PATHS.GET_NEW_DATA.D_M.PLAYER_MATCH_EVENT_LOG)
  .post(getPlayerMatchEventLog);
router
  .route(API_PATHS.GET_NEW_DATA.D_M.REFEREE_APPEARANCE)
  .post(getRefereeAppearance);
router
  .route(API_PATHS.GET_NEW_DATA.D_M.STAFF_APPEARANCE)
  .post(getStaffAppearance);
router
  .route(API_PATHS.GET_NEW_DATA.D_M.STAFF_MATCH_EVENT_LOG)
  .post(getStaffMatchEventLog);

export default router;
