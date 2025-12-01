import express from "express";
const router = express.Router();

import {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
} from "../controllers/models/match-format.js";
import { API_PATHS } from "@dai0413/shared";

router.route(API_PATHS.MATCH_FORMAT.ROOT).get(getAllItems).post(createItem);
router
  .route(API_PATHS.MATCH_FORMAT.DETAIL())
  .patch(updateItem)
  .delete(deleteItem)
  .get(getItem);

export default router;
