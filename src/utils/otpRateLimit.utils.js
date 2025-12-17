import rateLimit from "express-rate-limit";

// Limit OTP requests: max 5 requests per 10 minutes per IP
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // limit each IP to 5 requests per window
  message: {
    success: false,
    message: "Too many OTP requests. Please try again later."
  },
  standardHeaders: true, // return rate limit info in headers
  legacyHeaders: false,
});
