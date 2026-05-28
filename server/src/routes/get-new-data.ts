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

import { getValues as getValuesJ_M } from "../controllers/get-new-data/j_m/index.js";

import { getPositions } from "../controllers/get-new-data/sn_m/index.js";

import { getValues as getValuesD_M } from "../controllers/get-new-data/d_m/values.js";

import { getCardIds } from "../controllers/get-new-data/d_ml/card_ids.js";

import {
  getPositions as getPositionsL_M,
  getStats,
  getFormation,
  getValues as getValuesL_M,
} from "../controllers/get-new-data/l_m/index.js";

// D_PC
router.route(API_PATHS.GET_NEW_DATA.D_PC.PLAYER).get(getPlayers);
router
  .route(API_PATHS.GET_NEW_DATA.D_PC.PLAYER_REGISTRATION_HISTORY)
  .get(getPlayerRegistrationHistories);

// D_SC
router.route(API_PATHS.GET_NEW_DATA.D_SC.STAFF).get(getStaffs);
router
  .route(API_PATHS.GET_NEW_DATA.D_SC.STAFF_REGISTRATION_HISTORY)
  .get(getStaffRegistrationHistories);

// D_M
router.route(API_PATHS.GET_NEW_DATA.D_M.VALUES).post(getValuesD_M);

// D_ML
router.route(API_PATHS.GET_NEW_DATA.D_ML.CARD_IDS).post(getCardIds);

// J_M
router.route(API_PATHS.GET_NEW_DATA.J_M.MATCH).post(getValuesJ_M);

// l_m
router.route("/get-new-data/l-m/values").post(getValuesL_M);
// router.route(API_PATHS.GET_NEW_DATA.L_M.VALUES).post(getValuesL_M);
router.route(API_PATHS.GET_NEW_DATA.L_M.POSITION).post(getPositionsL_M);
router.route(API_PATHS.GET_NEW_DATA.L_M.STATS).post(getStats);
router.route(API_PATHS.GET_NEW_DATA.L_M.FORMATION).post(getFormation);

//SN_M
router.route(API_PATHS.GET_NEW_DATA.SN_M.POSITION).post(getPositions);

export default router;
