import express from "express";
import {
  signupController,
  loginController,
  getProfileController,
  updateProfileController,
  deleteProfileController,
} from "./auth.controller";
import authenticate from "../../middleware/authentication";

const router = express.Router();

// 📝 Signup
router.post("/signup", signupController);

// 🔐 Login
router.post("/login", loginController);

// 👤 Get My Profile
router.get("/me", authenticate(), getProfileController);

// 🔄 Update Profile
router.put("/me", authenticate(), updateProfileController);

// ❌ Delete Profile
router.delete("/me", authenticate(), deleteProfileController);

export default router;
