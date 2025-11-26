import express from "express";
const router = express.Router();

import {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
} from "../controllers/models/transfer.js";
import { API_PATHS } from "../api-paths.js";

router.route(API_PATHS.TRANSFER.ROOT).get(getAllItems).post(createItem);
router
  .route(API_PATHS.TRANSFER.DETAIL())
  .patch(updateItem)
  .delete(deleteItem)
  .get(getItem);

export default router;
