"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorMiddleWare = (err, req, res, next) => {
    console.error("Error:", err.message); // Log the error for debugging
    res.status(500).json({
        code: 500,
        success: false,
        message: "Internal Server Error",
        error: err.message,
    });
};
exports.default = errorMiddleWare;
