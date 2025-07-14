import { error } from "console";
import express, { NextFunction, Request, Response } from "express";
import logWrapper from "./logger/logger";
import errorMiddleWare from "./error/error_middle_ware";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Error middleware (must be after routes)

app.use(logWrapper({ value: true }));
app.use(errorMiddleWare);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
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
