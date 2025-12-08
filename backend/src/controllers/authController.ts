// src/controllers/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Parent, { IParent } from "../models/Parent";
import { generateToken } from "../utils/jwt";

// REGISTER PARENT
export const registerParent = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if email exists
    const existingParent = await Parent.findOne({ email });
    if (existingParent) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const parent: IParent = new Parent({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "parent",
    });

    await parent.save();

    // Generate JWT token
    const token = generateToken(parent._id.toString(), parent.role);

    res.status(201).json({
      message: "Parent registered successfully",
      token,
      parent: { id: parent._id, name: parent.name, email: parent.email },
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};


// LOGIN PARENT / STAFF
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await Parent.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id.toString(), user.role);

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
