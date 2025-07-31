import mongoose from "mongoose";
import { ITodo, todoSchema } from "../../schema/todoSchema";

const Todo = mongoose.model<ITodo>("Todo", todoSchema);

export class TodoService {
  // Get all todos for a user
  static async getAllTodos(
    userId: string,
    paginationOptions: {
      skip: number;
      take: number;
      limit: number;
      page: number;
    }
  ): Promise<{ todos: ITodo[]; total: number }> {
    try {
      const { skip, take } = paginationOptions;

      // Find todos with pagination
      const todos = await Todo.find({ userId }).skip(skip).limit(take);

      // Get the total count of todos for the user
      const total = await Todo.countDocuments({ userId });

      return { todos, total };
    } catch (error: any) {
      // Catch as 'any' or a more specific error type
      throw new Error(`Failed to fetch todos: ${error.message || error}`); // Improved error message
    }
  }

  // Get a single todo by ID
  static async getTodoById(todoId: string): Promise<ITodo | null> {
    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      throw new Error("Invalid Todo ID format");
    }
    try {
      return await Todo.findById(todoId);
    } catch (error) {
      throw new Error(`Failed to fetch todo: ${error}`);
    }
  }

  // Create a new todo
  static async createTodo(data: {
    title: string;
    description?: string;
    priority?: "HIGH" | "MEDIUM" | "LOW";
    subtasks?: { title: string; isCompleted?: boolean }[];
    isPinned?: boolean;
    userId: string;
  }): Promise<ITodo> {
    const { title, userId } = data;

    if (!title) {
      throw new Error("Title is required");
    }

    try {
      const newTodo = new Todo({
        title: data.title,
        description: data.description,
        priority: data.priority ?? "LOW",
        subtasks: data.subtasks,
        isPinned: data.isPinned ?? false,
        userId: userId,
      });

      return await newTodo.save();
    } catch (error: any) {
      throw new Error(`Failed to create todo: ${error.message}`);
    }
  }

  // Update a todo
  static async updateTodo(
    todoId: string,
    updateFields: Partial<{
      title: string;
      description: string;
      status: "ACTIVE" | "INACTIVE" | "COMPLETED";
      priority: "HIGH" | "MEDIUM" | "LOW";
      subtasks: { title: string; isCompleted: boolean }[];
      isPinned: boolean;
      completedAt: Date;
    }>
  ): Promise<ITodo | null> {
    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      throw new Error("Invalid Todo ID format");
    }

    if (Object.keys(updateFields).length === 0) {
      throw new Error("No valid fields provided for update");
    }

    try {
      const updatedTodo = await Todo.findByIdAndUpdate(todoId, updateFields, {
        new: true,
      });

      if (!updatedTodo) {
        throw new Error("Todo not found");
      }

      return updatedTodo;
    } catch (error: any) {
      throw new Error(`Failed to update todo: ${error.message}`);
    }
  }

  // Delete a todo
  static async deleteTodo(todoId: string): Promise<ITodo | null> {
    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      throw new Error("Invalid Todo ID format");
    }
    try {
      const deletedTodo = await Todo.findByIdAndDelete(todoId);
      if (!deletedTodo) {
        throw new Error("Todo not found");
      }
      return deletedTodo;
    } catch (error) {
      throw new Error(`Failed to delete todo: ${error}`);
    }
  }
}
