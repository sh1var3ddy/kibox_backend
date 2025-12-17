import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import Otp from "../models/Otp.model.js";

export const verifyOtpService = async ({ email, otp, purpose, onVerified }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid OTP");

  const otpRecord = await Otp.findOne({ userId: user._id, purpose });
  if (!otpRecord) throw new Error("OTP expired or invalid");

  if (otpRecord.expiresAt < new Date()) {
    await Otp.deleteOne({ _id: otpRecord._id });
    throw new Error("OTP expired");
  }

  const isValid = await bcrypt.compare(otp, otpRecord.otpHash);
  if (!isValid) throw new Error("Invalid OTP");

  // Optional callback to update user (like emailVerified)
  if (onVerified) await onVerified(user);

  await Otp.deleteOne({ _id: otpRecord._id });

  return { message: "OTP verified successfully", user:user};
};
