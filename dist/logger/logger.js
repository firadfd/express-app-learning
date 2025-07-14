"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = require("../handler");
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
                const responseBody = (0, handler_1.tryParseJSON)(responseBodyString);
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
exports.default = logWrapper;
