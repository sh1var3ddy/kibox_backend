import { registerUser } from "../services/user.signup.service.js";

import { StatusCodes } from "http-status-codes";

export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(`Signup request received for email: ${email}`);

    if (!name || !email || !password) {
      console.warn(`Incomplete signup data: ${JSON.stringify(req.body)}`);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Email, username, and password are required" });
    }

    // Call service
    const result = await registerUser({ name, email, password });

    // Respond with success
    console.log(`User registered successfully: ${email}`);
    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: result.message });

  } catch (err) {
    const status = err.statusCode || StatusCodes.BAD_REQUEST;
    console.error(`Signup error for email ${req.body.email}: ${err.message}`);
    return res.status(status).json({ success: false, message: err.message });
  }
};
