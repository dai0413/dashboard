import express, { RequestHandler } from "express";
const router = express.Router();

import {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  uploadItem,
  updateItems,
  deleteItems,
} from "../../controllers/models/stats-l.js";
import { API_PATHS } from "@dai0413/myorg-shared";
import upload from "../../middleware/upload.js";
import detectEncoding from "../../middleware/detectEncoding.js";
import checkFileExists from "../../middleware/checkFileExists.js";

router
  .route(API_PATHS.STATS_L.ROOT)
  .get(getAllItems)
  .post(createItem)
  .patch(updateItems)
  .delete(deleteItems);
router
  .route(API_PATHS.STATS_L.UPLOAD)
  .post(
    upload.single("file"),
    checkFileExists,
    detectEncoding as unknown as RequestHandler,
    uploadItem as unknown as RequestHandler,
  );
router
  .route(API_PATHS.STATS_L.DETAIL())
  .patch(updateItem)
  .delete(deleteItem)
  .get(getItem);

export default router;
