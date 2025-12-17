import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import Otp from "../models/Otp.model.js";

export const verifyEmailOtpService = async ({ email, otp }) => {

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid OTP");
  }


  if (user.emailVerified) {
    throw new Error("Email already verified");
  }

 
  const otpRecord = await Otp.findOne({
    userId: user._id,
    purpose: "EMAIL_VERIFY"
  });

  if (!otpRecord) {
    throw new Error("OTP expired or invalid");
  }

  if (otpRecord.expiresAt < new Date()) {
    await Otp.deleteOne({ _id: otpRecord._id });
    throw new Error("OTP expired");
  }

  const isValid = await bcrypt.compare(otp, otpRecord.otpHash);
  if (!isValid) {
    throw new Error("Invalid OTP");
  }

  user.emailVerified = true;
  await user.save();

  await Otp.deleteOne({ _id: otpRecord._id });

  return { message: "Email verified successfully" };
};
