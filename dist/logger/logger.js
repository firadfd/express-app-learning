"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const handler_1 = require("../handler");
const logWrapper = (options) => {
    if (!options.value) {
        return (req, res, next) => {
            next(new Error("Logging is disabled"));
        };
    }
    // Define custom Morgan tokens
    morgan_1.default.token("request-body", (req) => JSON.stringify(req.body));
    morgan_1.default.token("response-body", (req, res) => {
        // Access response body via res.locals.responseBody (set by custom middleware)
        return JSON.stringify((0, handler_1.tryParseJSON)(res.locals.responseBody || "{}"));
    });
    morgan_1.default.token("timestamp", () => {
        return `${new Date().toLocaleTimeString()} ${new Date().toDateString()}`;
    });
    // Custom middleware to capture response body
    const captureResponseBody = (req, res, next) => {
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
            res.locals.responseBody = responseBodyString;
            return oldEnd.apply(res, arguments);
        };
        next();
    };
    // Custom Morgan format
    const customFormat = JSON.stringify({
        url: ":url",
        timestamp: ":timestamp",
        method: ":method",
        headers: ":req[headers]",
        query: ":query",
        requestBody: ":request-body",
        statusCode: ":status",
        responseBody: ":response-body",
        duration: ":response-time ms",
    }, null, 2);
    return [captureResponseBody, (0, morgan_1.default)(customFormat)];
};
exports.default = logWrapper;
