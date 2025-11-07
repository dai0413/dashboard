import express, { RequestHandler } from "express";
const router = express.Router();

import {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  uploadItem,
} from "../controllers/models/match.js";

import upload from "../middleware/upload.js";
import detectEncoding from "../middleware/detectEncoding.js";
import checkFileExists from "../middleware/checkFileExists.js";

router.route("/").get(getAllItems).post(createItem);
router.route("/:id").patch(updateItem).delete(deleteItem).get(getItem);
router
  .route("/upload")
  .post(
    upload.single("file"),
    checkFileExists,
    detectEncoding as unknown as RequestHandler,
    uploadItem as unknown as RequestHandler
  );

export default router;
