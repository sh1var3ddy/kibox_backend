import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import Otp from "../models/Otp.model.js";
import { JWT_SECRET } from "../config/server.config.js";
import logger from "../utils/logger.js";
export const resetPasswordService = async ({ resetToken, newPassword }) => {
  try {
    const payload = jwt.verify(resetToken, JWT_SECRET);

    if (payload.purpose !== "PASSWORD_RESET") {
      throw new Error("Invalid reset token");
    }
    const user = await User.findById(payload.userId);
    if (!user) throw new Error("User not found");

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Delete any existing PASSWORD_RESET OTPs
    await Otp.deleteMany({ userId: user._id, purpose: "PASSWORD_RESET" });

  } catch (err) {
    if (err.name === "TokenExpiredError") throw new Error("Reset token expired");
    throw err;
  }
};
