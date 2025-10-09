import express from "express";
const router = express.Router();

import authmiddleware from "../middleware/auth.js";
import { register, login, logout, me, refresh } from "../controllers/auth.js";

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authmiddleware, logout);
router.get("/me", authmiddleware, me);
router.post("/refresh", refresh);

export default router;
