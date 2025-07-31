import { Request, Response } from "express";
import { TodoService } from "./todo.service";
import sendResponse from "../../shared/sendResponse";
import ApiError from "../../error/ApiError";
import httpStatus from "http-status";
import { paginationHelper } from "../../shared/paginations";

export class TodoController {
  // Get all todos
  static async getAllTodos(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user || !user.id) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "User not authenticated or ID missing"
        );
      }

      const userId = user.id;

      const { page, limit } = req.query;

      const currentPage = page ? Number(page) : 1;
      const itemsPerPage = limit ? Number(limit) : 10;

      const paginationOptions = paginationHelper({
        page: currentPage,
        limit: itemsPerPage,
      });

      const { todos, total } = await TodoService.getAllTodos(
        userId,
        paginationOptions
      );

      const totalPages = Math.ceil(total / itemsPerPage);

      sendResponse(res, {
        statusCode: httpStatus.OK, // Use httpStatus for clarity
        success: true,
        message: "All todos fetched successfully",
        data: {
          result: todos, // This aligns with your `TodoListResponse` model's `result` field being a list of Todos
          totalCount: total,
          currentPage: currentPage,
          totalPages: totalPages,
        },
      });
    } catch (error: any) {
      console.error("Error fetching todos:", error.message); // More descriptive error logging
      // Assuming ApiError has a statusCode or you can infer it
      const statusCode =
        error instanceof ApiError
          ? error.statusCode
          : httpStatus.INTERNAL_SERVER_ERROR;
      sendResponse(res, {
        statusCode: statusCode,
        success: false,
        message: error.message || "Server error",
        data: null,
      });
    }
  }

  // Get a single todo
  static async getTodoById(req: Request, res: Response): Promise<void> {
    try {
      const todoId = req.params.id;
      const todo = await TodoService.getTodoById(todoId);
      if (!todo) {
        sendResponse(res, {
          statusCode: 404,
          success: false,
          message: "Todo not found",
          data: null,
        });
        return;
      }
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Todo fetched successfully",
        data: todo,
      });
    } catch (error: any) {
      console.error("Error:", error.message);
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: error.message || "Server error",
        data: null,
      });
    }
  }

  // Create a new todo
  static async createTodo(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, priority, subtasks, isPinned } = req.body;

      const user = (req as any).user;
      if (!user || !user.id) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "User not authenticated or ID missing"
        );
      }

      const userId = user.id;

      if (!title) throw new Error("Title is required");

      const savedTodo = await TodoService.createTodo({
        title,
        description,
        priority,
        subtasks,
        isPinned,
        userId,
      });

      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Todo created successfully",
        data: savedTodo,
      });
    } catch (error: any) {
      console.error("Error:", error.message);
      sendResponse(res, {
        statusCode: error.message === "Title is required" ? 400 : 500,
        success: false,
        message:
          error.message === "Title is required"
            ? "Title is required"
            : "Internal Server Error",
        data: null,
      });
    }
  }

  // Update a todo
  static async updateTodo(req: Request, res: Response): Promise<void> {
    try {
      const todoId = req.params.id;

      const allowedFields = [
        "title",
        "description",
        "status",
        "priority",
        "dueDate",
        "reminderAt",
        "tags",
        "subtasks",
        "isPinned",
        "attachments",
        "completedAt",
      ];

      const updateFields: any = {};

      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updateFields[field] = req.body[field];
        }
      }

      if (Object.keys(updateFields).length === 0) {
        throw new Error("No valid fields provided for update");
      }

      const updatedTodo = await TodoService.updateTodo(todoId, updateFields);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Todo updated successfully",
        data: updatedTodo,
      });
    } catch (error: any) {
      console.error("Error:", error.message);
      sendResponse(res, {
        statusCode:
          error.message === "Invalid Todo ID format" ||
          error.message === "No valid fields provided for update"
            ? 400
            : error.message === "Todo not found"
            ? 404
            : 500,
        success: false,
        message:
          error.message === "Invalid Todo ID format" ||
          error.message === "No valid fields provided for update" ||
          error.message === "Todo not found"
            ? error.message
            : "Internal Server Error",
        data: null,
      });
    }
  }

  // Delete a todo
  static async deleteTodo(req: Request, res: Response): Promise<void> {
    try {
      const todoId = req.params.id;
      const deletedTodo = await TodoService.deleteTodo(todoId);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Todo deleted successfully",
        data: deletedTodo,
      });
    } catch (error: any) {
      console.error("Delete error:", error.message);
      sendResponse(res, {
        statusCode:
          error.message === "Invalid Todo ID format" ||
          error.message === "Todo not found"
            ? 400
            : 500,
        success: false,
        message:
          error.message === "Invalid Todo ID format" ||
          error.message === "Todo not found"
            ? error.message
            : "Server error",
        data: null,
      });
    }
  }
}
