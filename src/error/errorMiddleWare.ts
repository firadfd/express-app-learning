// error_middle_ware.ts
import { NextFunction, Request, Response } from "express";

const errorMiddleWare = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.statusCode ?? 500).json({
    code: err.statusCode ?? 500,
    success: false,
    message: `${err.message}`,
  });
};

export default errorMiddleWare;
