import express, { RequestHandler } from "express";
const router = express.Router();

import {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  uploadItem,
} from "../controllers/models/team-competition-season.js";
import upload from "../middleware/upload.js";
import detectEncoding from "../middleware/detectEncoding.js";
import checkFileExists from "../middleware/checkFileExists.js";
import { API_PATHS } from "@dai0413/myorg-shared";

router
  .route(API_PATHS.TEAM_COMPETITION_SEASON.ROOT)
  .get(getAllItems)
  .post(createItem);
router
  .route(API_PATHS.TEAM_COMPETITION_SEASON.DETAIL())
  .patch(updateItem)
  .delete(deleteItem)
  .get(getItem);
router
  .route(API_PATHS.TEAM_COMPETITION_SEASON.UPLOAD)
  .post(
    upload.single("file"),
    checkFileExists,
    detectEncoding as unknown as RequestHandler,
    uploadItem as unknown as RequestHandler
  );

export default router;
