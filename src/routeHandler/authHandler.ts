import express from "express";
import jwt from "jsonwebtoken";
import User from "../schema/userSchema";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = express.Router();

// ✅ Generate JWT
const generateToken = (user: any) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "30d" }
  );
};

// 📝 Signup
router.post("/signup", async (req, res): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      res
        .status(400)
        .json({ success: false, error: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      res.status(409).json({ success: false, error: "User already exists" });

    const user = new User({ name, email, password });
    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Signup successful",
      result: {
        accessToken: token,
        userInfo: { name: user.name, email: user.email },
      },
    });
  } catch (err: any) {
    console.error("Signup error:", err); // 👈 important
    res
      .status(500)
      .json({ success: false, error: err.message || "Server error" });
  }
});

// 🔐 Login
router.post("/login", async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      res
        .status(400)
        .json({ success: false, error: "Email and password are required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      res.status(401).json({ success: false, error: "Invalid credentials" });

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      result: { accessToken: token },
    });
  } catch (err: any) {
    console.error("Signup error:", err);
    res
      .status(500)
      .json({ success: false, error: err.message || "Server error" });
  }
});

// 👤 Get My Profile
router.get(
  "/me",
  authenticate,
  async (req: AuthRequest, res): Promise<void> => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user)
        res.status(404).json({ success: false, error: "User not found" });

      res.json({ success: true, result: user });
    } catch (err: any) {
      console.error("Signup error:", err);
      res
        .status(500)
        .json({ success: false, error: err.message || "Server error" });
    }
  }
);

// 🔄 Update Profile
router.put(
  "/me",
  authenticate,
  async (req: AuthRequest, res): Promise<void> => {
    try {
      const updates = req.body;
      const user = await User.findByIdAndUpdate(req.user.id, updates, {
        new: true,
      }).select("-password");

      res.json({ success: true, message: "Profile updated", result: user });
    } catch (err: any) {
      console.error("Signup error:", err);
      res
        .status(500)
        .json({ success: false, error: err.message || "Server error" });
    }
  }
);

// ❌ Delete Profile
router.delete(
  "/me",
  authenticate,
  async (req: AuthRequest, res): Promise<void> => {
    try {
      await User.findByIdAndDelete(req.user.id);
      res.json({ success: true, message: "User deleted" });
    } catch (err: any) {
      console.error("Signup error:", err);
      res
        .status(500)
        .json({ success: false, error: err.message || "Server error" });
    }
  }
);

export default router;
