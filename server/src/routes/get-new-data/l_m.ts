import express from "express";
const router = express.Router();

import { API_PATHS } from "@dai0413/myorg-shared";

import {
  getPositions as getPositionsL_M,
  getStats,
  getFormation,
  getValues as getValuesL_M,
} from "../../controllers/get-new-data/l_m/index.js";

// l_m
router.route(API_PATHS.GET_NEW_DATA.L_M.VALUES).post(getValuesL_M);
router.route(API_PATHS.GET_NEW_DATA.L_M.POSITION).post(getPositionsL_M);
router.route(API_PATHS.GET_NEW_DATA.L_M.STATS).post(getStats);
router.route(API_PATHS.GET_NEW_DATA.L_M.FORMATION).post(getFormation);

export default router;
