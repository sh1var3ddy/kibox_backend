import bcrypt from "bcryptjs";
import Otp from "../models/Otp.model.js";
import { generateOtp } from "../utils/otp.util.js";
import { sendEmail } from "../utils/email.util.js";
import logger from "../utils/logger.js";

const OTP_EXPIRY_MINUTES = 5;

export const sendPasswordResetOtp = async (user) => {
  try {
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    await Otp.deleteMany({
      userId: user._id,
      purpose: "PASSWORD_RESET"
    });

    await Otp.create({
      userId: user._id,
      otpHash,
      purpose: "PASSWORD_RESET",
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)
    });

    await sendEmail({
      to: user.email,
      subject: "Password Reset Code",
      text: `Your password reset code is ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`
    });

    logger.info(`Password reset OTP sent to ${user.email}`);

  } catch (err) {
    logger.error(`Failed to send password reset OTP: ${err.message}`);
    throw new Error("Failed to send reset code");
  }
};
