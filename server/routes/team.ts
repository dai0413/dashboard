import express from "express";
const router = express.Router();

import {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  downloadItem,
} from "../controllers/models/team.js";
import { API_PATHS } from "@dai0413/myorg-shared";

router.route(API_PATHS.TEAM.ROOT).get(getAllItems).post(createItem);
router.route(API_PATHS.TEAM.DOWNLOAD).get(downloadItem);
router
  .route(API_PATHS.TEAM.DETAIL())
  .patch(updateItem)
  .delete(deleteItem)
  .get(getItem);

export default router;
