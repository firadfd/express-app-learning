"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authHandler_1 = __importDefault(require("../routeHandler/authHandler"));
const todoHandler_1 = __importDefault(require("../routeHandler/todoHandler"));
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: authHandler_1.default,
    },
    {
        path: "/todos",
        route: todoHandler_1.default,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
