import express from "express";
const router = express.Router();

import { API_PATHS } from "@dai0413/myorg-shared";
import { getPositions } from "../../controllers/get-new-data/sn_m/index.js";

router.route(API_PATHS.GET_NEW_DATA.SN_M.POSITION).post(getPositions);

export default router;
