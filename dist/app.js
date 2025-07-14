"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logWrapper = void 0;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
const logWrapper = (options) => {
    return (req, res, next) => {
        if (options.value) {
            const start = Date.now();
            const { method, originalUrl, headers, query, body } = req;
            const oldWrite = res.write;
            const oldEnd = res.end;
            const chunks = [];
            res.write = function (chunk) {
                chunks.push(Buffer.from(chunk));
                return oldWrite.apply(res, arguments);
            };
            res.end = function (chunk) {
                if (chunk) {
                    chunks.push(Buffer.from(chunk));
                }
                const responseBodyString = Buffer.concat(chunks).toString("utf8");
                const responseBody = tryParseJSON(responseBodyString);
                const duration = Date.now() - start;
                const log = {
                    url: originalUrl,
                    timestamp: `${new Date().toLocaleTimeString()} ${new Date().toDateString()}`,
                    method,
                    headers,
                    query,
                    requestBody: body,
                    statusCode: res.statusCode,
                    responseBody,
                    duration: `${duration}ms`,
                };
                console.log(JSON.stringify(log, null, 2));
                return oldEnd.apply(res, arguments);
            };
            next();
        }
        else {
            next(new Error("There is an error happened"));
        }
    };
};
exports.logWrapper = logWrapper;
// Helper to parse JSON safely
function tryParseJSON(str) {
    try {
        return JSON.parse(str);
    }
    catch (e) {
        return str;
    }
}
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
// Error middleware (must be after routes)
const errorMiddleWare = (error, req, res, next) => {
    console.log(error);
    res
        .status(500)
        .json({ message: "There was a server side error", error: error.message });
};
// Apply middleware
app.use((0, exports.logWrapper)({ value: true }));
app.use(errorMiddleWare);
exports.default = app; // Export for Vercel
