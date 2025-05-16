import express, { Request, Response } from "express";
import { userInfo } from "os";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Main route
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
      github: "WWW.github.com/firadfd",
      linkedin: "WWW.linkedin.com/in/firadfd",
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
