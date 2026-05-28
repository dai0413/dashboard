import express from "express";
const router = express.Router();

import { API_PATHS } from "@dai0413/myorg-shared";
import { getCardIds } from "../../controllers/get-new-data/d_ml/card_ids.js";

router.route(API_PATHS.GET_NEW_DATA.D_ML.CARD_IDS).post(getCardIds);

export default router;
