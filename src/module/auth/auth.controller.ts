import { Request, Response } from "express";
import {
  signup,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
} from "./auth.service";
import sendResponse from "../../shared/sendResponse";

export const signupController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res
        .status(400)
        .json({ success: false, error: "All fields are required" });
      return;
    }

    const { user, token } = await signup(name, email, password);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User successfully logged in",
      data: {
        accessToken: token,
        userInfo: { name: user.name, email: user.email },
      },
    });
  } catch (err: any) {
    console.error("Signup error:", err);
    res.status(err.message === "User already exists" ? 409 : 500).json({
      success: false,
      error: err.message || "Server error",
    });
  }
};

export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, error: "Email and password are required" });
      return;
    }

    const { token } = await login(email, password);
    res.status(200).json({
      success: true,
      message: "Login successful",
      result: { accessToken: token },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(err.message === "Invalid credentials" ? 401 : 500).json({
      success: false,
      error: err.message || "Server error",
    });
  }
};

export const getProfileController = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const user = await getProfile(req.user.id);
    res.json({ success: true, result: user });
  } catch (err: any) {
    console.error("Get profile error:", err);
    res.status(err.message === "User not found" ? 404 : 500).json({
      success: false,
      error: err.message || "Server error",
    });
  }
};

export const updateProfileController = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const updates = req.body;
    const user = await updateProfile(req.user.id, updates);
    res.json({ success: true, message: "Profile updated", result: user });
  } catch (err: any) {
    console.error("Update profile error:", err);
    res.status(err.message === "User not found" ? 404 : 500).json({
      success: false,
      error: err.message || "Server error",
    });
  }
};

export const deleteProfileController = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    await deleteProfile(req.user.id);
    res.json({ success: true, message: "User deleted" });
  } catch (err: any) {
    console.error("Delete profile error:", err);
    res.status(err.message === "User not found" ? 404 : 500).json({
      success: false,
      error: err.message || "Server error",
    });
  }
};
