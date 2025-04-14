const express = require("express");
const router = express.Router();

const authmiddleware = require("../middleware/auth");
const { register, login, logout, me, refresh } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authmiddleware, logout);
router.get("/me", authmiddleware, me);
router.post("/refresh", refresh);

module.exports = router;
