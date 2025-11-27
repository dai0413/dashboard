import express from "express";
const router = express.Router();

import {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
} from "../controllers/models/player-registration-history.js";
import { API_PATHS } from "@myorg/shared";

router
  .route(API_PATHS.PLAYER_REGISTRATION_HISTORY.ROOT)
  .get(getAllItems)
  .post(createItem);
router
  .route(API_PATHS.PLAYER_REGISTRATION_HISTORY.DETAIL())
  .patch(updateItem)
  .delete(deleteItem)
  .get(getItem);

export default router;
