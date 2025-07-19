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
const auth_1 = require("../middleware/auth");
const mongoose_1 = __importDefault(require("mongoose"));
const Todo = mongoose_1.default.model("Todo", todoSchema_1.todoSchema);
const router = express_1.default.Router();
//Get all todos
router.get("/", auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todos = yield Todo.find();
        res.status(200).json({
            success: true,
            message: "All todos fetched successfully",
            result: todos,
        });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            code: 500,
            success: false,
            message: "Internal Server Error",
            error: error,
        });
    }
}));
//Get single todo
router.get("/:id", auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
//Add todo
router.post("/", auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.title) {
            res.status(400).json({ success: false, error: "Title is required" });
            return;
        }
        const newTodo = new Todo({
            title: req.body.title,
            description: req.body.description,
        });
        const savedTodo = yield newTodo.save();
        res
            .status(201)
            .json({ success: false, message: "Todo created", result: savedTodo });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            code: 500,
            success: false,
            message: "Internal Server Error",
            error: error,
        });
    }
}));
//put todo
router.put("/:id", auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todoId = req.params.id;
        if (!todoId) {
            res
                .status(400)
                .json({ success: false, error: "id is required in URL parameter" });
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
            res.status(400).json({
                success: false,
                error: "No valid fields provided for update",
            });
            return;
        }
        const updatedTodo = yield Todo.findByIdAndUpdate(todoId, updateFields, {
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
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            code: 500,
            success: false,
            message: "Internal Server Error",
            error: error,
        });
    }
}));
//delete todo
router.delete("/:id", auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        if (!mongoose_1.default.Types.ObjectId.isValid(todoId)) {
            res.status(400).json({
                success: false,
                error: "Invalid Todo ID format",
            });
            return;
        }
        const deletedTodo = yield Todo.findByIdAndDelete(todoId);
        if (!deletedTodo) {
            res.status(404).json({ success: false, error: "Todo not found" });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Todo deleted successfully",
            result: deletedTodo,
        });
    }
    catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
}));
exports.default = router;
