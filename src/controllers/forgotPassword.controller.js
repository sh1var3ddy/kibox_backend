import { forgotPasswordService } from "../services/forgotPassword.service.js";
import logger from "../utils/logger.js";
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    await forgotPasswordService(email);

    return res.status(200).json({
      message: "If the email exists, a reset code has been sent"
    });

  } catch (err) {
    logger.error(`Forgot password failed: ${err.message}`);
    return res.status(500).json({ message: "Something went wrong" });
  }
};