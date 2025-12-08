import mongoose, { Schema, Document, Types } from "mongoose";

export interface IStudent extends Document {
  name: string;
  class: string;
  section: string;
  rollNumber: string;
  parentId: Types.ObjectId; // <-- use Types.ObjectId
}

const studentSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    class: { type: String, required: true },
    section: { type: String, required: true },
    rollNumber: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, ref: "Parent", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IStudent>("Student", studentSchema);
