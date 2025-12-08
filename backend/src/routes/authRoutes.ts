// src/routes/authRoutes.ts
import express from "express";
import { registerParent, loginUser } from "../controllers/authController";

const router = express.Router();

// Register Parent
router.post("/register", registerParent);

// Login Parent / Staff
router.post("/login", loginUser);

export default router;
