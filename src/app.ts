import express, { Request, Response } from "express";
import { userInfo } from "os";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Main route
app.get("/", (req: Request, res: Response) => {
  res.format({
    "application/json": () => {
      res.json({
        code: 200,
        success: true,
        message: {
          title: "Welcome to the API",
          description: "This is a simple Express API.",
          developer: "Firad Fd",
          email: "firadfd833@gmail.com",
          version: "1.0.0",
        },
      });
    },
    "text/html": () => {
      res.json({
        code: 200,
        success: true,
        message: {
          title: "Welcome to the API",
          description: "This is a simple Express API.",
        },
      });
    },
    default: () => {
      res.json({
        code: 200,
        success: true,
        message: {
          title: "Welcome to the API",
        },
      });
    },
  });
});

// signup route
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

// login route
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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
