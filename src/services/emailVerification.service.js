import bcrypt from "bcryptjs";
import Otp from "../models/Otp.model.js";
import { generateOtp } from "../utils/otp.util.js";
import { sendEmail } from "../utils/email.util.js";
import logger from "../utils/logger.js";

const OTP_EXPIRY_MINUTES = 3;

export const sendEmailVerificationOtp = async (user) => {
  try {
    // 1️⃣ Generate OTP and hash it
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    logger.info(`Generated OTP for userId: ${user._id}, email: ${user.email}`);

    // 2️⃣ Remove any existing OTPs for email verification
    await Otp.deleteMany({
      userId: user._id,
      purpose: "EMAIL_VERIFY"
    });
    logger.info(`Removed old OTPs for userId: ${user._id}`);

    // 3️⃣ Store new OTP in DB
    await Otp.create({
      userId: user._id,
      otpHash,
      purpose: "EMAIL_VERIFY",
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)
    });
    logger.info(`Stored new OTP in DB for userId: ${user._id}`);

    // 4️⃣ Send OTP email — must succeed
    try {
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        text: `Your email verification code is ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`
      });
      logger.info(`OTP email sent successfully to: ${user.email}`);
    } catch (emailErr) {
      logger.error(`Failed to send OTP email to ${user.email}: ${emailErr.message}`);
      throw new Error("Failed to send verification email. Please try again later.");
    }

    return { success: true };

  } catch (err) {
    logger.error(`Failed to generate/send email OTP for userId: ${user._id}, error: ${err.message}`);
    throw err; // propagate to service → controller
  }
};
