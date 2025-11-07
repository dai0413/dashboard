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

import upload from "../middleware/upload.js";
import detectEncoding from "../middleware/detectEncoding.js";
import checkFileExists from "../middleware/checkFileExists.js";

router.route("/").get(getAllItems).post(createItem);
router.route("/check").post(checkItem);
router
  .route("/upload")
  .post(
    upload.single("file"),
    checkFileExists,
    detectEncoding as unknown as RequestHandler,
    uploadItem as unknown as RequestHandler
  );
router.route("/download").get(downloadItem);
router.route("/:id").patch(updateItem).delete(deleteItem).get(getItem);

export default router;
