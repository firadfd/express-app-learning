import mongoose, { Schema, Document } from "mongoose";

export interface ITodo extends Document {
  title: string;
  description?: string;
  status: "ACTIVE" | "INACTIVE" | "COMPLETED";
  priority: "HIGH" | "MEDIUM" | "LOW";
  isPinned?: boolean;
  userId: mongoose.Schema.Types.ObjectId;
  subtasks?: {
    title: string;
    isCompleted: boolean;
  }[];
}

const todoSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "COMPLETED"],
      default: "ACTIVE",
    },

    priority: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW"],
      default: "LOW",
    },
    isPinned: { type: Boolean, default: false },
    subtasks: [
      {
        _id: false,
        title: { type: String, required: true },
        isCompleted: { type: Boolean, default: false },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export { todoSchema };
