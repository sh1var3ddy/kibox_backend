import {resetPasswordService} from "../services/resetPassword.service.js";
import logger from "../utils/logger.js";

export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: "Reset token and new password are required" });
    }

    await resetPasswordService({ resetToken, newPassword });

    res.status(200).json({ message: "Password reset successful" });

  } catch (err) {
    logger.error(`Password reset failed: ${err.message}`);
    res.status(400).json({ message: err.message });
  }
};
