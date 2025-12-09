import express from "express";
const router = express.Router();

import {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
} from "../controllers/models/formation.js";
import { API_PATHS } from "@dai0413/myorg-shared";

router.route(API_PATHS.FORMATION.ROOT).get(getAllItems).post(createItem);
router
  .route(API_PATHS.FORMATION.DETAIL())
  .patch(updateItem)
  .delete(deleteItem)
  .get(getItem);

export default router;
