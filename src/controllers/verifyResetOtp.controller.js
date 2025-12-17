import { verifyOtpService } from "../services/verifyOtp.service.js";
import logger from "../utils/logger.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/server.config.js";
export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Verify OTP using generic service
    const { user } = await verifyOtpService({
        email,
        otp,
        purpose: "PASSWORD_RESET",
        onVerified: async (user) => user // optional
    });

    
    logger.info(user._id);
    // Generate short-lived JWT reset token
    const resetToken = jwt.sign(
      { userId: user._id, purpose: "PASSWORD_RESET" },
      JWT_SECRET,
      { expiresIn: "20m" }
    );

    res.status(200).json({
      message: "OTP verified successfully",
      resetToken
    });

  } catch (err) {
    logger.error(`Reset OTP verification failed: ${err.message}`);
    res.status(400).json({ message: err.message });
  }
};
