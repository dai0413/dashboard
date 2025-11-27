import express from "express";
const router = express.Router();

import { getTopPageData } from "../controllers/top.js";
import { API_PATHS } from "@myorg/shared";

router.route(API_PATHS.TOP_PAGE.GET).get(getTopPageData);

export default router;
