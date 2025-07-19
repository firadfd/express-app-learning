import express from "express";
import { AuthController } from "./auth.controller";
import authenticate from "../../middleware/authentication";

const router = express.Router();

// Public routes
router.post("/signup", AuthController.signupController);
router.post("/login", AuthController.loginController);

// Protected routes
router.get("/profile", authenticate(), AuthController.getProfileController);
router.put("/profile", authenticate(), AuthController.updateProfileController);
router.delete(
  "/profile",
  authenticate(),
  AuthController.deleteProfileController
);

export default router;
