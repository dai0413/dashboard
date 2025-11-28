import express from "express";
const router = express.Router();

import {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
} from "../controllers/models/team-competition-season.js";
import { API_PATHS } from "@myorg/shared";

router
  .route(API_PATHS.TEAM_COMPETITION_SEASON.ROOT)
  .get(getAllItems)
  .post(createItem);
router
  .route(API_PATHS.TEAM_COMPETITION_SEASON.DETAIL())
  .patch(updateItem)
  .delete(deleteItem)
  .get(getItem);

export default router;
