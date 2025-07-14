import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import logWrapper from "./logger/logger";
import errorMiddleWare from "./error/error_middle_ware";
import todoHandler from "./routeHandler/todoHandler";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use("/todos", todoHandler);
app.use(logWrapper({ value: true }));
app.use(errorMiddleWare);

//database connectin with mongoose
mongoose
  .connect(process.env.MONGO_URI!)
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
app.get("/", (req: Request, res: Response) => {
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

app.post("/signup", (req: Request, res: Response) => {
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

app.post("/login", (req: Request, res: Response) => {
  res.json({
    code: 200,
    success: true,
    message: "Login successful",
    result: {
      accessToken: "test-token",
    },
  });
});

export default app; // Export for Vercel
