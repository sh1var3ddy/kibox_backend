import bcrypt from "bcryptjs";
import { findUserByEmail, createUser } from "../repositories/user.repository.js";
import { sendEmailVerificationOtp } from "./emailVerification.service.js";
import logger from "../utils/logger.js";

const SALT_ROUNDS = 10;

export const registerUser = async ({ name, email, password }) => {
  try {
    logger.info(`Register request received for email: ${email}`);

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      logger.warn(`Attempt to register already registered email: ${email}`);
      const error = new Error("Email already registered");
      error.statusCode = 409; // Conflict
      throw error;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await createUser({
      name,
      email,
      password: hashedPassword
    });
    logger.info(`User created successfully with email: ${email}, userId: ${user._id}`);

    // Send OTP
    try {
      await sendEmailVerificationOtp(user);
      logger.info(`Email verification OTP sent to: ${email}`);
    } catch (emailErr) {
      logger.error(`Failed to send OTP email to ${email}: ${emailErr.message}`);
      const error = new Error("User created, but failed to send OTP. Please try resending OTP.");
      error.statusCode = 500; // Internal server error for email
      throw error;
    }

    return {
      message: "User registered successfully. Please verify your email with the OTP sent."
    };
  } catch (err) {
    logger.error(`Failed to register user with email ${email}: ${err.message}`);
    throw err; 
  }
};
