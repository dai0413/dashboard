import express from "express";
const router = express.Router();

import { API_PATHS } from "@dai0413/myorg-shared";
import {
  getPlayers,
  getPlayerRegistrationHistories,
} from "../controllers/get-new-data/d_pc/index.js";
import {
  getStaffs,
  getStaffRegistrationHistories,
} from "../controllers/get-new-data/d_sc/index.js";

import { getValues } from "../controllers/get-new-data/j_m/index.js";

import { getPositions } from "../controllers/get-new-data/sn_m/index.js";

// D_PC
router.route(API_PATHS.GET_NEW_DATA.D_PC.PLAYER).get(getPlayers);
router
  .route(API_PATHS.GET_NEW_DATA.D_PC.PLAYER_REGISTRATION_HISTORY)
  .get(getPlayerRegistrationHistories);
router.route(API_PATHS.GET_NEW_DATA.D_SC.STAFF).get(getStaffs);
router
  .route(API_PATHS.GET_NEW_DATA.D_SC.STAFF_REGISTRATION_HISTORY)
  .get(getStaffRegistrationHistories);

// J_M
router.route(API_PATHS.GET_NEW_DATA.J_M.MATCH).post(getValues);

//SN_M
router.route(API_PATHS.GET_NEW_DATA.SN_M.POSITION).post(getPositions);

export default router;
