import express, { RequestHandler } from "express";
const router = express.Router();

import {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  downloadItems,
  uploadItem,
} from "../controllers/models/staff.js";
import { API_PATHS } from "@dai0413/myorg-shared";
import upload from "../middleware/upload.js";
import detectEncoding from "../middleware/detectEncoding.js";
import checkFileExists from "../middleware/checkFileExists.js";

router.route(API_PATHS.STAFF.ROOT).get(getAllItems).post(createItem);
router
  .route(API_PATHS.STAFF.UPLOAD)
  .post(
    upload.single("file"),
    checkFileExists,
    detectEncoding as unknown as RequestHandler,
    uploadItem as unknown as RequestHandler
  );
router.route(API_PATHS.STAFF.DOWNLOAD).get(downloadItems);
router
  .route(API_PATHS.STAFF.DETAIL())
  .patch(updateItem)
  .delete(deleteItem)
  .get(getItem);

export default router;
