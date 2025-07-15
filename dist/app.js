"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./logger/logger"));
const errorMiddleWare_1 = __importDefault(require("./error/errorMiddleWare"));
const todoHandler_1 = __importDefault(require("./routeHandler/todoHandler"));
const authHandler_1 = __importDefault(require("./routeHandler/authHandler"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
//database connectin with mongoose
mongoose_1.default
    .connect(process.env.MONGO_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
    .then(() => {
    console.log("✅ MongoDB connected successfully!");
    // Only listen locally
    if (process.env.NODE_ENV !== "production") {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running at: http://localhost:${PORT}`);
        });
    }
})
    .catch((error) => {
    console.error("❌ DB connection error:", error);
    process.exit(1);
});
// Routes
app.get("/", (req, res) => {
    res.json({
        code: 200,
        success: true,
        message: "This is the main route",
        result: {
            title: "Welcome to my express learning app",
            description: "lets explore the world how do backend works",
            developer: "Firad Fd",
            email: "firadfd833@gmail.com",
            github: "www.github.com/firadfd",
            linkedin: "www.linkedin.com/in/firadfd",
        },
    });
    // Note: This throw triggers the error middleware
    throw new Error("this is the error message");
});
app.use("/todos", todoHandler_1.default);
app.use("/auth", authHandler_1.default);
app.use((0, logger_1.default)({ value: true }));
app.use(errorMiddleWare_1.default);
exports.default = app;
