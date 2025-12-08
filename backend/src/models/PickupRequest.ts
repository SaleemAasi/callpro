// src/models/PickupRequest.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IPickupRequest extends Document {
  student: mongoose.Types.ObjectId;
  parent: mongoose.Types.ObjectId;
  status: "pending" | "completed";
  createdAt: Date;
}

const pickupSchema: Schema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    parent: { type: Schema.Types.ObjectId, ref: "Parent", required: true },
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
  },
  { timestamps: true }
);

const PickupRequest = mongoose.model<IPickupRequest>("PickupRequest", pickupSchema);
export default PickupRequest;
