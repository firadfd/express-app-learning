import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import ApiError from "../error/ApiError";
import User from "../schema/userSchema";

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
      const userId = (verifiedUser as any)._id || (verifiedUser as any).id;

      // 🔍 Check if user exists in the database
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
      }

      req.user = user;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default authenticate;
