import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    dueDate: Date,
    priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH"], default: "LOW" },
    status: { type: String, enum: ["TODO", "IN_PROGRESS", "COMPLETED"], default: "TODO" },
    createdBy: String,
    assignedTo: String,
  },
  { timestamps: true }
);

export const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);
