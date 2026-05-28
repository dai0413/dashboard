import express from "express";
const router = express.Router();

import { API_PATHS } from "@dai0413/myorg-shared";
import { getValues as getValuesD_M } from "../../controllers/get-new-data/d_m/values.js";

router.route(API_PATHS.GET_NEW_DATA.D_M.VALUES).post(getValuesD_M);

export default router;
