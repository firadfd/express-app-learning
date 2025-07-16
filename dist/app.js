"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./logger/logger"));
const errorMiddleWare_1 = __importDefault(require("./error/errorMiddleWare"));
const routes_1 = __importDefault(require("./routeHandler/routes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
app.use((0, logger_1.default)({ value: true }));
// Database connection with mongoose
mongoose_1.default
    .connect(process.env.MONGO_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
    .then(() => {
    console.log("✅ MongoDB connected successfully!");
    // Start server
    app.listen(PORT, () => {
        console.log(`🚀 Server running at: http://localhost:${PORT}`);
    });
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
    });
});
// API routes
app.use("/api/v1", routes_1.default);
// Error middleware (must be last)
app.use(errorMiddleWare_1.default);
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found!",
        },
    });
});
exports.default = app;
