import express from "express";
const router = express.Router();

import { API_PATHS } from "@dai0413/myorg-shared";
import { getItem } from "../controllers/upload-status.js";

router.get(API_PATHS.UPLOAD_STATUS(), getItem);

export default router;
