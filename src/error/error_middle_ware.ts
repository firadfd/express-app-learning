import { Request, Response, NextFunction } from "express";

const errorMiddleWare = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);
  res
    .status(500)
    .json({ message: "There was a server side error", error: error.message });
};

export default errorMiddleWare;
