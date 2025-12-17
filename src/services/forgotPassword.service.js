import User from "../models/User.model.js";
import {sendPasswordResetOtp} from "./passwordResetOtp.service.js";
import logger from "../utils/logger.js";

export const forgotPasswordService = async (email) => {
  try {
    logger.info(`Password reset requested for email: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Password reset requested for non-existing email`);
      return;
    }

    await sendPasswordResetOtp(user);

  } catch (err) {
    logger.error(`Forgot password service error: ${err.message}`);
    throw err;
  }
};
