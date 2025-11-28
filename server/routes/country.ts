import express from "express";
const router = express.Router();

import {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
} from "../controllers/models/country.js";
import { API_PATHS } from "@myorg/shared";

router.route(API_PATHS.COUNTRY.ROOT).get(getAllItems).post(createItem);
router
  .route(API_PATHS.COUNTRY.DETAIL())
  .patch(updateItem)
  .delete(deleteItem)
  .get(getItem);

export default router;
