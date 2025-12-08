// src/models/Parent.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IParent extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "parent" | "staff";
}

const parentSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ["parent", "staff"], default: "parent" },
  },
  { timestamps: true }
);

const Parent = mongoose.model<IParent>("Parent", parentSchema);
export default Parent;
