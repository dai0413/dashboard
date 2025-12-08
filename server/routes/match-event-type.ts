import express from "express";
const router = express.Router();

import {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
} from "../controllers/models/match-event-type.js";
import { API_PATHS } from "@dai0413/myorg-shared";

router.route(API_PATHS.MATCH_EVENT_TYPE.ROOT).get(getAllItems).post(createItem);
router
  .route(API_PATHS.MATCH_EVENT_TYPE.DETAIL())
  .patch(updateItem)
  .delete(deleteItem)
  .get(getItem);

export default router;
