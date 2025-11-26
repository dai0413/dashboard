import express from "express";
const router = express.Router();

import {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
} from "../controllers/models/referee.js";
import { API_PATHS } from "../api-paths.js";

router.route(API_PATHS.REFEREE.ROOT).get(getAllItems).post(createItem);
router
  .route(API_PATHS.REFEREE.DETAIL())
  .patch(updateItem)
  .delete(deleteItem)
  .get(getItem);

export default router;
