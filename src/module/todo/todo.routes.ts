import express from "express";
import { TodoController } from "./todo.controller";
import authenticate from "../../middleware/authentication";

const router = express.Router();

// Get all todos
router.get("/", authenticate(), TodoController.getAllTodos);

// Get a single todo
router.get("/:id", authenticate(), TodoController.getTodoById);

// Create a new todo
router.post("/", authenticate(), TodoController.createTodo);

// Update a todo
router.put("/:id", authenticate(), TodoController.updateTodo);

// Delete a todo
router.delete("/:id", authenticate(), TodoController.deleteTodo);

export default router;
