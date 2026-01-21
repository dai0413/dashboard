import express from "express";
const router = express.Router();

import {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
} from "../controllers/models/staff-match-event-log.js";
import { API_PATHS } from "@dai0413/myorg-shared";

router
  .route(API_PATHS.STAFF_MATCH_EVENT_LOG.ROOT)
  .get(getAllItems)
  .post(createItem);
router
  .route(API_PATHS.STAFF_MATCH_EVENT_LOG.DETAIL())
  .patch(updateItem)
  .delete(deleteItem)
  .get(getItem);

export default router;
