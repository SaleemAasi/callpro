import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICall extends Document {
  studentId: Types.ObjectId;
  parentId: Types.ObjectId;
  calledAt: Date;
  expiresAt: Date;
  pickedUp: boolean;
}

const callSchema: Schema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  parentId: { type: Schema.Types.ObjectId, ref: "Parent", required: true },
  calledAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  pickedUp: { type: Boolean, default: false },
});

export default mongoose.model<ICall>("Call", callSchema);
