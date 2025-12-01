import express from "express";
const router = express.Router();

import {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  downloadItems,
} from "../controllers/models/national-match-series.js";
import { API_PATHS } from "@dai0413/shared";

router
  .route(API_PATHS.NATIONAL_MATCH_SERIES.ROOT)
  .get(getAllItems)
  .post(createItem);
router.route(API_PATHS.NATIONAL_MATCH_SERIES.DOWNLOAD).get(downloadItems);
router
  .route(API_PATHS.NATIONAL_MATCH_SERIES.DETAIL())
  .patch(updateItem)
  .delete(deleteItem)
  .get(getItem);

export default router;
