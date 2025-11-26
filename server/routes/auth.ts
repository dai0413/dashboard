import express from "express";
const router = express.Router();

import authmiddleware from "../middleware/auth.js";
import { register, login, logout, me, refresh } from "../controllers/auth.js";
import { API_PATHS } from "@myorg/shared";

router.post(API_PATHS.AUTH.REGISTER, register);
router.post(API_PATHS.AUTH.LOGIN, login);
router.post(API_PATHS.AUTH.LOGOUT, authmiddleware, logout);
router.get(API_PATHS.AUTH.ME, authmiddleware, me);
router.post(API_PATHS.AUTH.REFRESH, refresh);

export default router;
