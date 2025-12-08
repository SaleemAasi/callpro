// src/controllers/studentController.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import Student, { IStudent } from "../models/Student";
import Call, { ICall } from "../models/Call"; // make sure to create this model

// Register a new student
export const registerStudent = async (req: Request, res: Response) => {
  try {
    const { name, class: studentClass, section, rollNumber, parentId } = req.body;

    if (!name || !studentClass || !section || !rollNumber || !parentId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const student: IStudent = new Student({
      name,
      class: studentClass,
      section,
      rollNumber,
      parentId,
    });

    await student.save();

    res.status(201).json({ message: "Student registered successfully", student });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Get all students of a parent
export const getMyChildren = async (req: Request, res: Response) => {
  try {
    const { parentId } = req.params;

    if (!parentId) {
      return res.status(400).json({ message: "Parent ID is required" });
    }

    const parentObjectId = new mongoose.Types.ObjectId(parentId);
    const students = await Student.find({ parentId: { $eq: parentObjectId } });

    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Parent calls a child
export const callChild = async (req: Request, res: Response) => {
  try {
    const { studentId, parentId } = req.body;

    if (!studentId || !parentId) {
      return res.status(400).json({ message: "Student ID and Parent ID are required" });
    }

    const studentObjectId = new mongoose.Types.ObjectId(studentId);
    const parentObjectId = new mongoose.Types.ObjectId(parentId);

    // ✅ Check if this parent already has an active call
    const now = new Date();
    const existingCall = await Call.findOne({
      parentId: parentObjectId,
      pickedUp: false,
      expiresAt: { $gt: now },
    });

    if (existingCall) {
      return res.status(400).json({ message: "You already have an active call" });
    }

    // ✅ Create new call
    const calledAt = new Date();
    const expiresAt = new Date(calledAt.getTime() + 10 * 60 * 1000); // 10 min later

    const newCall = new Call({
      studentId: studentObjectId,
      parentId: parentObjectId,
      calledAt,
      expiresAt,
    });

    await newCall.save();

    res.status(201).json({ message: "Child called successfully", call: newCall });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};


// Get all active calls
export const getChildCalls = async (req: Request, res: Response) => {
  try {
    const now = new Date();

    // ✅ Only include calls that are not picked up and not expired
    const calls = await Call.find({
      pickedUp: false,
      expiresAt: { $gt: now },
    }).populate("studentId", "name class section rollNumber");

    res.status(200).json({ calls });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
// Mark call as picked up
export const pickUpCall = async (req: Request, res: Response) => {
  try {
    const { callId } = req.body;

    if (!callId) {
      return res.status(400).json({ message: "Call ID is required" });
    }

    const call = await Call.findById(callId);
    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    call.pickedUp = true;
    await call.save();

    res.status(200).json({ message: "Call picked up successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};


