// error_middle_ware.ts
import { NextFunction, Request, Response } from "express";

const errorMiddleWare = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err.message); // Log the error for debugging
  res.status(500).json({
    code: 500,
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
};

export default errorMiddleWare;
