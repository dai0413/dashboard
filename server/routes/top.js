import express from "express";
const router = express.Router();

import { getTopPageData } from "../controllers/top.js";

router.route("/").get(getTopPageData);

export default router;
