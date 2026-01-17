import { loginUser } from "../services/user.signin.service.js";

import { StatusCodes } from "http-status-codes";

export const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.warn("Signin failed: missing email or password");
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Email and password are required" });
    }

    const { user, token } = await loginUser({ email, password });

    console.log(`User logged in successfully: ${email}`);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "User logged in successfully",
      data: { user, token }
    });

  } catch (err) {
    console.error(`Signin failed for email ${req.body.email}: ${err.message}`);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: err.message });
  }
};

