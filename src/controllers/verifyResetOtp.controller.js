import { verifyOtpService } from "../services/verifyOtp.service.js";

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/server.config.js";
import { StatusCodes } from "http-status-codes";

export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      console.warn("Reset OTP verification failed: missing email or otp");
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email and OTP are required" });
    }

    // Verify OTP using generic service
    const { user } = await verifyOtpService({
      email,
      otp,
      purpose: "PASSWORD_RESET",
      onVerified: async (user) => user // optional, do nothing
    });

    if (!user) {
      console.warn(`Reset OTP verification failed: user not found for email ${email}`);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid OTP or user not found" });
    }

    // Generate short-lived JWT reset token
    const resetToken = jwt.sign(
      { userId: user._id, purpose: "PASSWORD_RESET" },
      JWT_SECRET,
      { expiresIn: "20m" }
    );

    console.log(`Reset OTP verified successfully for email: ${email}`);
    return res.status(StatusCodes.OK).json({
      message: "OTP verified successfully",
      resetToken
    });

  } catch (err) {
    console.error(`Reset OTP verification failed for email ${req.body.email}: ${err.message}`);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: err.message });
  }
};
