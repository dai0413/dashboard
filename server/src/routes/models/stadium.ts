import express from "express";
const router = express.Router();

import {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  updateItems,
  deleteItems,
} from "../../controllers/models/stadium.js";
import { API_PATHS } from "@dai0413/myorg-shared";

router
  .route(API_PATHS.STADIUM.ROOT)
  .get(getAllItems)
  .post(createItem)
  .patch(updateItems)
  .delete(deleteItems);
router
  .route(API_PATHS.STADIUM.DETAIL())
  .patch(updateItem)
  .delete(deleteItem)
  .get(getItem);

export default router;
