import express from "express";
const router = express.Router();

import { API_PATHS } from "@dai0413/myorg-shared";
import { getValues as getValuesJ_M } from "../../controllers/get-new-data/j_m/index.js";

router.route(API_PATHS.GET_NEW_DATA.J_M.MATCH).post(getValuesJ_M);

export default router;
