import express from "express";
import authHandler from "../module/auth/auth.routes";
// import todosHandler from "../module/todo/todo.routes";
import todoHandler from "./todoHandler";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authHandler,
  },
  {
    path: "/todos",
    route: todoHandler,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
