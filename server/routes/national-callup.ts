import express from "express";
const router = express.Router();

import {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
} from "../controllers/models/national-callup.js";
import { API_PATHS } from "@dai0413/myorg-shared";

router.route(API_PATHS.NATIONAL_CALLUP.ROOT).get(getAllItems).post(createItem);
router
  .route(API_PATHS.NATIONAL_CALLUP.DETAIL())
  .patch(updateItem)
  .delete(deleteItem)
  .get(getItem);

export default router;
