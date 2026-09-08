import express from "express";
const router = express.Router();

import { API_PATHS } from "@dai0413/myorg-shared";
import {
  getPositions,
  getValues,
  getMatch,
  getPlayerAppearance,
  getPlayerMatchEventLog,
  getRefereeAppearance,
  getStaffAppearance,
  getStaffMatchEventLog,
} from "../../controllers/get-new-data/sn_m/index.js";

router.route(API_PATHS.GET_NEW_DATA.SN_M.POSITION).post(getPositions);
router.route(API_PATHS.GET_NEW_DATA.SN_M.VALUES).post(getValues);
router.route(API_PATHS.GET_NEW_DATA.SN_M.MATCH).post(getMatch);
router
  .route(API_PATHS.GET_NEW_DATA.SN_M.PLAYER_APPEARANCE)
  .post(getPlayerAppearance);
router
  .route(API_PATHS.GET_NEW_DATA.SN_M.PLAYER_MATCH_EVENT_LOG)
  .post(getPlayerMatchEventLog);
router
  .route(API_PATHS.GET_NEW_DATA.SN_M.REFEREE_APPEARANCE)
  .post(getRefereeAppearance);
router
  .route(API_PATHS.GET_NEW_DATA.SN_M.STAFF_APPEARANCE)
  .post(getStaffAppearance);
router
  .route(API_PATHS.GET_NEW_DATA.SN_M.STAFF_MATCH_EVENT_LOG)
  .post(getStaffMatchEventLog);
export default router;
