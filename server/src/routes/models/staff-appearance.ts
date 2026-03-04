import express, { RequestHandler } from "express";
const router = express.Router();

import {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  uploadItem,
} from "../../controllers/models/staff-appearance.js";
import upload from "../../middleware/upload.js";
import detectEncoding from "../../middleware/detectEncoding.js";
import checkFileExists from "../../middleware/checkFileExists.js";
import { API_PATHS } from "@dai0413/myorg-shared";

router.route(API_PATHS.STAFF_APPEARANCE.ROOT).get(getAllItems).post(createItem);
router
  .route(API_PATHS.STAFF_APPEARANCE.DETAIL())
  .patch(updateItem)
  .delete(deleteItem)
  .get(getItem);
router
  .route(API_PATHS.STAFF_APPEARANCE.UPLOAD)
  .post(
    upload.single("file"),
    checkFileExists,
    detectEncoding as unknown as RequestHandler,
    uploadItem as unknown as RequestHandler,
  );

export default router;
