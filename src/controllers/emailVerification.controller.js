import User from "../models/User.model.js";
import { sendEmailVerificationOtp } from "../services/emailVerification.service.js";
import { verifyOtpService } from "../services/verifyOtp.service.js";

import { StatusCodes } from "http-status-codes";

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(`Resend OTP request received for email: ${email}`);

    if (!email) {
      console.warn(`Resend OTP failed: missing email`);
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Resend OTP: email not found in DB: ${email}`);
      return res.status(StatusCodes.OK).json({
        message: "If the email exists, a verification code has been sent"
      });
    }

    if (user.emailVerified) {
      console.log(`Resend OTP: email already verified: ${email}`);
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email already verified" });
    }

    try {
      await sendEmailVerificationOtp(user);
      console.log(`OTP resent successfully to email: ${email}`);
      res.status(StatusCodes.OK).json({ message: "Verification OTP sent" });
    } catch (otpErr) {
      console.error(`Failed to resend OTP to ${email}: ${otpErr.message}`);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Failed to send verification email. Please try again later."
      });
    }

  } catch (err) {
    console.error(`Error in resendEmailOtp controller for email ${req.body.email}: ${err.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};


export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(`Verify OTP request received for email: ${email}`);

    if (!email || !otp) {
      console.warn(`Verify OTP failed: missing email or otp`);
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email and OTP are required" });
    }

    try {
      const { user, message } = await verifyOtpService({
        email,
        otp,
        purpose: "EMAIL_VERIFY",
        onVerified: async (user) => {
          user.emailVerified = true;
          await user.save();
        }
      });
      console.log(`OTP verified successfully for email: ${email}`);
      res.status(StatusCodes.OK).json({ message });
    } catch (otpErr) {
      console.warn(`OTP verification failed for email ${email}: ${otpErr.message}`);
      res.status(StatusCodes.BAD_REQUEST).json({ message: otpErr.message });
    }

  } catch (err) {
    console.error(`Error in verifyEmailOtp controller for email ${req.body.email}: ${err.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};
