import express, { NextFunction, Request, Response } from "express";
import { todoSchema } from "../schema/todoSchema";
import { ITodo } from "../schema/todoSchema";

import mongoose from "mongoose";
import authenticate from "../middleware/authentication";
const Todo = mongoose.model<ITodo>("Todo", todoSchema);

const router = express.Router();

//Get all todos
router.get(
  "/",
  authenticate(),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const todos = await Todo.find();
      res.status(200).json({
        success: true,
        message: "All todos fetched successfully",
        result: todos,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        code: 500,
        success: false,
        message: "Internal Server Error",
        error: error,
      });
    }
  }
);

//Get single todo
router.get(
  "/:id",
  authenticate(),
  async (req: Request, res: Response): Promise<void> => {}
);

//Add todo
router.post(
  "/",
  authenticate(),
  async (req: any, res: Response): Promise<void> => {
    try {
      if (!req.body.title) {
        res.status(400).json({ success: false, error: "Title is required" });
        return;
      }
      const newTodo = new Todo({
        title: req.body.title,
        description: req.body.description,
        userId: req.user.id,
      });

      const savedTodo = await newTodo.save();
      res
        .status(201)
        .json({ success: false, message: "Todo created", result: savedTodo });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        code: 500,
        success: false,
        message: "Internal Server Error",
        error: error,
      });
    }
  }
);

//put todo
router.put(
  "/:id",
  authenticate(),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const todoId = req.params.id;

      if (!todoId) {
        res
          .status(400)
          .json({ success: false, error: "id is required in URL parameter" });
        return;
      }

      // Prepare the update object only with allowed fields
      const updateFields: Partial<{
        title: string;
        description: string;
        status: string;
      }> = {};

      if (req.body.title !== undefined) updateFields.title = req.body.title;
      if (req.body.description !== undefined)
        updateFields.description = req.body.description;
      if (req.body.status !== undefined) updateFields.status = req.body.status;

      if (Object.keys(updateFields).length === 0) {
        res.status(400).json({
          success: false,
          error: "No valid fields provided for update",
        });
        return;
      }

      const updatedTodo = await Todo.findByIdAndUpdate(todoId, updateFields, {
        new: true,
      });

      if (!updatedTodo) {
        res.status(404).json({ success: false, error: "Todo not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Todo updated successfully",
        result: updatedTodo,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        code: 500,
        success: false,
        message: "Internal Server Error",
        error: error,
      });
    }
  }
);

//delete todo
router.delete(
  "/:id",
  authenticate(),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const todoId = req.params.id;

      if (!todoId) {
        res.status(400).json({
          success: false,
          error: "Todo ID is required in URL parameter",
        });
        return;
      }

      // ✅ Check for valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(todoId)) {
        res.status(400).json({
          success: false,
          error: "Invalid Todo ID format",
        });
        return;
      }

      const deletedTodo = await Todo.findByIdAndDelete(todoId);

      if (!deletedTodo) {
        res.status(404).json({ success: false, error: "Todo not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Todo deleted successfully",
        result: deletedTodo,
      });
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  }
);

export default router;
