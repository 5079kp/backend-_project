import express from "express";

import { login, logout, register, getProfile } from "../controllers/adminController.js";
import { isAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isAuth, getProfile);

export default router;