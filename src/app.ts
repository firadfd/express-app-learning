import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import logWrapper from "./logger/logger";
import errorMiddleWare from "./error/errorMiddleWare";
import routes from "./routes/routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(logWrapper({ value: true }));

// Database connection with mongoose
mongoose
  .connect(process.env.MONGO_URI!, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running at: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ DB connection error:", error);
    process.exit(1);
  });

// Routes
app.get("/", (res: Response) => {
  res.json({
    code: 200,
    success: true,
    message: "This is the main route",
  });
});

// API routes
app.use("/api/v1", routes);

// Error middleware (must be last)
app.use(errorMiddleWare);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
