import { forgotPasswordService } from "../services/forgotPassword.service.js";

import { StatusCodes } from "http-status-codes";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      console.warn("Forgot password failed: missing email");
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email is required" });
    }

    await forgotPasswordService(email);
    console.log(`Forgot password request processed for email: ${email}`);

    return res
      .status(StatusCodes.OK)
      .json({ message: "If the email exists, a reset code has been sent" });

  } catch (err) {
    console.error(`Forgot password failed: ${err.message}`);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
};
