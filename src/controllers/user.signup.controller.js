import { registerUser } from "../services/user.signup.service.js";
import logger from "../utils/logger.js";

export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    logger.info(`Signup request received in controller for email: ${email}`);

    if (!name || !email || !password) {
      logger.warn(`Incomplete signup data: ${JSON.stringify(req.body)}`);
      return res.status(400).json({ 
        success: false, 
        message: "Email, username, and password are required" 
      });
    }

    // Call service
    const result = await registerUser({ name, email, password });

    // Respond with success
    res.status(201).json({
      success: true,
      message: result.message
    });

  } catch (err) {
    // Use statusCode from service if present, else 400
    const status = err.statusCode || 400;
    logger.error(`Error during signup for email ${req.body.email}: ${err.message}`);
    res.status(status).json({ 
      success: false, 
      message: err.message 
    });
  }
};
