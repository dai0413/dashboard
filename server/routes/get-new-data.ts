import express from "express";
const router = express.Router();

import { API_PATHS } from "@dai0413/myorg-shared";
import {
  getPlayers,
  getPlayerRegistrationHistories,
} from "../controllers/get-new-data/d_pc/index.js";

router.route(API_PATHS.GET_NEW_DATA.D_PC.PLAYER).get(getPlayers);
router
  .route(API_PATHS.GET_NEW_DATA.D_PC.PLAYER_REGISTRATION_HISTORY)
  .get(getPlayerRegistrationHistories);

export default router;
