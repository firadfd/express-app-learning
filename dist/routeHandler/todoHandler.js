"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todoSchema_1 = require("../schema/todoSchema");
const mongoose_1 = __importDefault(require("mongoose"));
const Todo = mongoose_1.default.model("Todo", todoSchema_1.todoSchema);
const route = express_1.default.Router();
//Get all todos
route.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todos = yield Todo.find(); // fetch all todos from DB
        res.status(200).json({
            message: "All todos fetched successfully",
            todos,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}));
//Get single todo
route.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
//Add todo
route.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.title) {
            res.status(400).json({ error: "Title is required" });
            return;
        }
        const newTodo = new Todo({
            title: req.body.title,
            description: req.body.description,
        });
        const savedTodo = yield newTodo.save();
        res.status(201).json({ message: "Todo created", todo: savedTodo });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}));
//put todo
route.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todoId = req.params.id;
        if (!todoId) {
            res.status(400).json({ error: "id is required in URL parameter" });
            return;
        }
        // Prepare the update object only with allowed fields
        const updateFields = {};
        if (req.body.title !== undefined)
            updateFields.title = req.body.title;
        if (req.body.description !== undefined)
            updateFields.description = req.body.description;
        if (req.body.status !== undefined)
            updateFields.status = req.body.status;
        if (Object.keys(updateFields).length === 0) {
            res.status(400).json({ error: "No valid fields provided for update" });
            return;
        }
        const updatedTodo = yield Todo.findByIdAndUpdate(todoId, updateFields, {
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}));
//delete todo
route.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todoId = req.params.id;
        if (!todoId) {
            res.status(400).json({ error: "Todo ID is required in URL parameter" });
            return;
        }
        const deletedTodo = yield Todo.findByIdAndDelete(todoId);
        if (!deletedTodo) {
            res.status(404).json({ error: "Todo not found or already deleted" });
            return;
        }
        res.status(200).json({
            message: "Todo deleted successfully",
            todo: deletedTodo,
        });
    }
    catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ error: "Server error" });
    }
}));
exports.default = route;
