import { Request, Response } from "express";
import {
  signup,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
} from "./auth.service";
import sendResponse from "../../shared/sendResponse";
import ApiError from "../../error/ApiError";
import httpStatus from "http-status";

export class AuthController {
  static async signupController(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        sendResponse(res, {
          statusCode: 400,
          success: false,
          message: "All fields are required",
          data: null,
        });
        return;
      }

      const { user, token } = await signup(name, email, password);
      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User successfully signed up",
        data: {
          accessToken: token,
          userInfo: { name: user.name, email: user.email },
        },
      });
    } catch (err: any) {
      console.error("Signup error:", err.message);
      sendResponse(res, {
        statusCode: err.message === "User already exists" ? 409 : 500,
        success: false,
        message: err.message || "Server error",
        data: null,
      });
    }
  }

  static async loginController(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        sendResponse(res, {
          statusCode: 400,
          success: false,
          message: "Email and password are required",
          data: null,
        });
        return;
      }

      const { token } = await login(email, password);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Login successful",
        data: { accessToken: token },
      });
    } catch (err: any) {
      console.error("Login error:", err.message);
      sendResponse(res, {
        statusCode: err.message === "Invalid credentials" ? 401 : 500,
        success: false,
        message: err.message || "Server error",
        data: null,
      });
    }
  }

  static async getProfileController(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const userReq = (req as any).user;
      if (!userReq || !userReq.id) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "User not authenticated or ID missing"
        );
      }
      const userId = userReq.id;
      const user = await getProfile(userId);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Profile fetched successfully",
        data: user,
      });
    } catch (err: any) {
      console.error("Get profile error:", err.message);
      sendResponse(res, {
        statusCode: err.message === "User not found" ? 404 : 500,
        success: false,
        message: err.message || "Server error",
        data: null,
      });
    }
  }

  static async updateProfileController(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const updates = req.body;
      const userReq = (req as any).user;
      if (!userReq || !userReq.id) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "User not authenticated or ID missing"
        );
      }
      const userId = userReq.id;
      const user = await updateProfile(userId, updates);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Profile updated successfully",
        data: user,
      });
    } catch (err: any) {
      console.error("Update profile error:", err.message);
      sendResponse(res, {
        statusCode: err.message === "User not found" ? 404 : 500,
        success: false,
        message: err.message || "Server error",
        data: null,
      });
    }
  }

  static async deleteProfileController(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const userReq = (req as any).user;
      if (!userReq || !userReq.id) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "User not authenticated or ID missing"
        );
      }
      const userId = userReq.id;
      await deleteProfile(userId);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User deleted successfully",
        data: null,
      });
    } catch (err: any) {
      console.error("Delete profile error:", err.message);
      sendResponse(res, {
        statusCode: err.message === "User not found" ? 404 : 500,
        success: false,
        message: err.message || "Server error",
        data: null,
      });
    }
  }
}
