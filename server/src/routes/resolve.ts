import express from "express";
const router = express.Router();

import { API_PATHS } from "@dai0413/myorg-shared";

import { resolveModelData } from "src/controllers/resolve/resolve.js";

router.route(API_PATHS.RESOLVE.MODEL_DATA).post(resolveModelData);

export default router;
