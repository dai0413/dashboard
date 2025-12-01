import express, { RequestHandler } from "express";
const router = express.Router();

import {
  getAllItems,
  createItem,
  checkItem,
  getItem,
  updateItem,
  deleteItem,
  uploadItem,
  downloadItem,
} from "../controllers/models/player.js";
import { API_PATHS } from "@dai0413/myorg-shared";
import upload from "../middleware/upload.js";
import detectEncoding from "../middleware/detectEncoding.js";
import checkFileExists from "../middleware/checkFileExists.js";

router.route(API_PATHS.PLAYER.ROOT).get(getAllItems).post(createItem);
router.route(API_PATHS.PLAYER.CHECK).post(checkItem);
router
  .route(API_PATHS.PLAYER.UPLOAD)
  .post(
    upload.single("file"),
    checkFileExists,
    detectEncoding as unknown as RequestHandler,
    uploadItem as unknown as RequestHandler
  );
router.route(API_PATHS.PLAYER.DOWNLOAD).get(downloadItem);
router
  .route(API_PATHS.PLAYER.DETAIL())
  .patch(updateItem)
  .delete(deleteItem)
  .get(getItem);

export default router;
