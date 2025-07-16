import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import ApiError from "../error/ApiError";

const authenticate = () => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }

      const verifiedUser = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = verifiedUser;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default authenticate;
