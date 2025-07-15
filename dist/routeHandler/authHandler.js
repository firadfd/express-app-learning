"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema_1 = __importDefault(require("../schema/userSchema"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// ✅ Generate JWT
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
    }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
// 📝 Signup
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            res
                .status(400)
                .json({ success: false, error: "All fields are required" });
        const existingUser = yield userSchema_1.default.findOne({ email });
        if (existingUser)
            res.status(409).json({ success: false, error: "User already exists" });
        const user = new userSchema_1.default({ name, email, password });
        yield user.save();
        const token = generateToken(user);
        res.status(201).json({
            success: true,
            message: "Signup successful",
            result: {
                accessToken: token,
                userInfo: { name: user.name, email: user.email },
            },
        });
    }
    catch (err) {
        console.error("Signup error:", err); // 👈 important
        res
            .status(500)
            .json({ success: false, error: err.message || "Server error" });
    }
}));
// 🔐 Login
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            res
                .status(400)
                .json({ success: false, error: "Email and password are required" });
        const user = yield userSchema_1.default.findOne({ email }).select("+password");
        if (!user || !(yield user.comparePassword(password)))
            res.status(401).json({ success: false, error: "Invalid credentials" });
        const token = generateToken(user);
        res.status(200).json({
            success: true,
            message: "Login successful",
            result: { accessToken: token },
        });
    }
    catch (err) {
        console.error("Signup error:", err);
        res
            .status(500)
            .json({ success: false, error: err.message || "Server error" });
    }
}));
// 👤 Get My Profile
router.get("/me", auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userSchema_1.default.findById(req.user.id).select("-password");
        if (!user)
            res.status(404).json({ success: false, error: "User not found" });
        res.json({ success: true, result: user });
    }
    catch (err) {
        console.error("Signup error:", err);
        res
            .status(500)
            .json({ success: false, error: err.message || "Server error" });
    }
}));
// 🔄 Update Profile
router.put("/me", auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updates = req.body;
        const user = yield userSchema_1.default.findByIdAndUpdate(req.user.id, updates, {
            new: true,
        }).select("-password");
        res.json({ success: true, message: "Profile updated", result: user });
    }
    catch (err) {
        console.error("Signup error:", err);
        res
            .status(500)
            .json({ success: false, error: err.message || "Server error" });
    }
}));
// ❌ Delete Profile
router.delete("/me", auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userSchema_1.default.findByIdAndDelete(req.user.id);
        res.json({ success: true, message: "User deleted" });
    }
    catch (err) {
        console.error("Signup error:", err);
        res
            .status(500)
            .json({ success: false, error: err.message || "Server error" });
    }
}));
exports.default = router;
