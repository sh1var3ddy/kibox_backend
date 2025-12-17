import User from "../models/User.model.js";
import { sendEmailVerificationOtp } from "../services/emailVerification.service.js";
import { verifyOtpService } from "../services/verifyOtp.service.js";
import logger from "../utils/logger.js";

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    logger.info(`Resend OTP request received for email: ${email}`);

    if (!email) {
      logger.warn(`Resend OTP failed: missing email`);
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      logger.info(`Resend OTP: email not found in DB: ${email}`);
      return res.status(200).json({
        message: "If the email exists, a verification code has been sent"
      });
    }

    if (user.emailVerified) {
      logger.info(`Resend OTP: email already verified: ${email}`);
      return res.status(400).json({ message: "Email already verified" });
    }

    try {
      await sendEmailVerificationOtp(user);
      logger.info(`OTP resent successfully to email: ${email}`);
      res.status(200).json({ message: "Verification OTP sent" });
    } catch (otpErr) {
      logger.error(`Failed to resend OTP to ${email}: ${otpErr.message}`);
      res.status(500).json({ message: "Failed to send verification email. Please try again later." });
    }

  } catch (err) {
    logger.error(`Error in resendEmailOtp controller for email ${req.body.email}: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    logger.info(`Verify OTP request received for email: ${email}`);

    if (!email || !otp) {
      logger.warn(`Verify OTP failed: missing email or otp`);
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    try {
      const {result} = await verifyOtpService({
        email,
        otp,
        purpose: "EMAIL_VERIFY",
        onVerified: async (user) => {
            user.emailVerified = true;
            await user.save();
        }
        });
      logger.info(`OTP verified successfully for email: ${email}`);
      res.status(200).json(result);
    } catch (otpErr) {
      logger.warn(`OTP verification failed for email ${email}: ${otpErr.message}`);
      res.status(400).json({ message: otpErr.message });
    }

  } catch (err) {
    logger.error(`Error in verifyEmailOtp controller for email ${req.body.email}: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
