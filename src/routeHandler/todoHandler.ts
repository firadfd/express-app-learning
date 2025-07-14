import express, { NextFunction, Request, Response } from "express";
import { todoSchema } from "../schema/todoSchema";
import { ITodo } from "../schema/todoSchema";

import mongoose from "mongoose";
const Todo = mongoose.model<ITodo>("Todo", todoSchema);

const route = express.Router();

//Get all todos
route.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const todos = await Todo.find(); // fetch all todos from DB
    res.status(200).json({
      message: "All todos fetched successfully",
      todos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

//Get single todo
route.get("/:id", async (req: Request, res: Response): Promise<void> => {});

//Add todo
route.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body.title) {
      res.status(400).json({ error: "Title is required" });
      return;
    }

    const newTodo = new Todo({
      title: req.body.title,
      description: req.body.description,
    });

    const savedTodo = await newTodo.save();
    res.status(201).json({ message: "Todo created", todo: savedTodo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

//put todo
route.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const todoId = req.params.id;

    if (!todoId) {
      res.status(400).json({ error: "id is required in URL parameter" });
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
      res.status(400).json({ error: "No valid fields provided for update" });
      return;
    }

    const updatedTodo = await Todo.findByIdAndUpdate(todoId, updateFields, {
      new: true,
    });

    if (!updatedTodo) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }

    res.status(200).json({
      message: "Todo updated successfully",
      todo: updatedTodo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

//delete todo
route.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const todoId = req.params.id;

    if (!todoId) {
      res.status(400).json({ error: "Todo ID is required in URL parameter" });
      return;
    }

    const deletedTodo = await Todo.findByIdAndDelete(todoId);

    if (!deletedTodo) {
      res.status(404).json({ error: "Todo not found or already deleted" });
      return;
    }

    res.status(200).json({
      message: "Todo deleted successfully",
      todo: deletedTodo,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default route;
