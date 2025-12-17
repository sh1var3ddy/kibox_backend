import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "../config/server.config.js";
import logger from "./logger.js";

export const sendEmail = async ({ to, subject, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: EMAIL_USER,
      to,
      subject,
      text
    });
    logger.info("Email sent successfully");
    return {
      success: true,
      messageId: info.messageId
    };

  } catch (error) {
    logger.error("Email send failed:", {
      to,
      subject,
      error: error.message
    });

    // Decide how you want to handle failure
    throw new Error("Failed to send email");
  }
};
