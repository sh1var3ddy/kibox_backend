import express from "express";
import {
  resendEmailOtp,
  verifyEmailOtp
} from "../../controllers/emailVerification.controller.js";

const router = express.Router();

router.post("/resend-otp", resendEmailOtp);
router.post("/verify-otp", verifyEmailOtp);

export default router;