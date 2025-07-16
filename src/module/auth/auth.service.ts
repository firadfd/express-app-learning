import jwt from "jsonwebtoken";
import User, { IUser } from "../../schema/userSchema";
import ApiError from "../../error/ApiError";
import httpStatus from "http-status";

// Generate JWT
export const generateToken = (user: IUser): string => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "1h" }
  );
};

// Signup logic
export const signup = async (
  name: string,
  email: string,
  password: string
): Promise<{ user: IUser; token: string }> => {
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(httpStatus.ALREADY_REPORTED, "User already exists");
  }

  const user = new User({ name, email: email.toLowerCase(), password });
  await user.save();
  const token = generateToken(user);
  return { user, token };
};

// Login logic
export const login = async (
  email: string,
  password: string
): Promise<{ user: IUser; token: string }> => {
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }
  const token = generateToken(user);
  return { user, token };
};

// Get profile logic
export const getProfile = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

// Update profile logic
export const updateProfile = async (
  userId: string,
  updates: Partial<IUser>
): Promise<IUser> => {
  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
  }).select("-password");
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

// Delete profile logic
export const deleteProfile = async (userId: string): Promise<void> => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
};
