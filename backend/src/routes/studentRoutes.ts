import express from "express";
import { registerStudent, getMyChildren, callChild, getChildCalls } from "../controllers/studentController";

const router = express.Router();

// Register student
router.post("/register", registerStudent);

// Get children of a parent
router.get("/mychildren/:parentId", getMyChildren);

// Parent calls a child
router.post("/call", callChild);

// Get all active calls (for display board)
router.get("/calls", getChildCalls);
// routes/studentRoutes.ts


export default router;
