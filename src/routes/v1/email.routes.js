import express from "express";
import {
  resendOtp,
  verifyOtp
} from "../../controllers/emailVerification.controller.js";
import { verifyResetOtp } from "../../controllers/verifyResetOtp.controller.js";
import { otpLimiter } from "../../utils/otpRateLimit.utils.js";
const router = express.Router();

router.post("/resend-otp", otpLimiter,resendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/verify-reset-otp", verifyResetOtp)

export default router;