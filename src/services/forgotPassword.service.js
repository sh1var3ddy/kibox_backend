import User from "../models/User.model.js";
import { sendPasswordResetOtp } from "./passwordResetOtp.service.js";


export const forgotPasswordService = async (email) => {
  try {
    console.log(`Password reset requested for email: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      console.warn(`Password reset requested for non-existing email`);
      return;
    }

    await sendPasswordResetOtp(user);

  } catch (err) {
    console.error(`Forgot password service error: ${err.message}`);
    throw err;
  }
};
