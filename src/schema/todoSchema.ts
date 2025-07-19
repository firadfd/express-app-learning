import mongoose, { Schema, Document } from "mongoose";
import { ref } from "process";

export interface ITodo extends Document {
  title: string;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
  date: Date;
}

const todoSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    versionKey: false,
  }
);

export { todoSchema };
