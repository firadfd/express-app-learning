"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./logger/logger"));
const error_middle_ware_1 = __importDefault(require("./error/error_middle_ware"));
const todoHandler_1 = __importDefault(require("./routeHandler/todoHandler"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
app.use("/todos", todoHandler_1.default);
app.use((0, logger_1.default)({ value: true }));
app.use(error_middle_ware_1.default);
//database connectin with mongoose
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    console.log("✅ MongoDB connected successfully!");
    app.listen(PORT, () => {
        console.log(`🚀 Server running at: http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error("❌ DB connection error:", error);
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
app.post("/signup", (req, res) => {
    res.json({
        code: 200,
        success: true,
        message: "Signup successful",
        result: {
            accessToken: "test-token",
            userInfo: {
                name: req.body.name,
                email: req.body.email,
                pass: req.body.pass,
            },
        },
    });
});
app.post("/login", (req, res) => {
    res.json({
        code: 200,
        success: true,
        message: "Login successful",
        result: {
            accessToken: "test-token",
        },
    });
});
exports.default = app; // Export for Vercel
