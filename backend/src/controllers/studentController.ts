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
// src/controllers/studentController.ts
export const getMyChildren = async (req: Request, res: Response) => {
  try {
    const { parentId } = req.params;
    if (!parentId) return res.status(400).json({ message: "Parent ID required" });

    const parentObjectId = new mongoose.Types.ObjectId(parentId);

    const students = await Student.find({ parentId: parentObjectId });

    // ✅ Include last call info
    const studentsWithLastCall = await Promise.all(
      students.map(async (student) => {
        const lastCall = await Call.findOne({
          studentId: student._id,
          parentId: parentObjectId,
        }).sort({ calledAt: -1 }); // latest call

        return {
          ...student.toObject(),
          lastCallAt: lastCall?.calledAt || null, // frontend will use this
        };
      })
    );

    res.status(200).json({ students: studentsWithLastCall });
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

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // ✅ Check if this student has already been called today by this parent
    const existingCall = await Call.findOne({
      parentId: parentObjectId,
      studentId: studentObjectId,
      calledAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingCall) {
      return res.status(400).json({ message: "You have already called this child today" });
    }

    // ✅ Create new call
    const calledAt = now;
    const expiresAt = new Date(calledAt.getTime() + 10 * 60 * 1000); // 10 min

    const newCall = new Call({
      studentId: studentObjectId,
      parentId: parentObjectId,
      calledAt,
      expiresAt,
      pickedUp: false,
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


