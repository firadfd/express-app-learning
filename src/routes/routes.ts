import express from "express";
import authHandler from "../module/auth/auth.routes";
import todoHandler from "../module/todo/todo.routes";

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
