"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorMiddleWare = (error, req, res, next) => {
    console.error(error);
    res
        .status(500)
        .json({ message: "There was a server side error", error: error.message });
};
exports.default = errorMiddleWare;
