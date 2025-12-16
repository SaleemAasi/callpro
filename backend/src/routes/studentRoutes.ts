import express from "express";
import {
  registerStudent,
  getMyChildren,
  callChild,
  getChildCalls,
  pickupCall,
  resetCalls, // import here
} from "../controllers/studentController";

const router = express.Router();

// Register student
router.post("/register", registerStudent);

// Get children of a parent
router.get("/mychildren/:parentId", getMyChildren);

// Parent calls a child
router.post("/call", callChild);

// Get all active calls
router.get("/calls", getChildCalls);

// Pickup call
router.post("/pickup", pickupCall);

// Reset calls (practice only)
router.post("/reset-calls", resetCalls);

export default router;
