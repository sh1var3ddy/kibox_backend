import express from "express";
import { signupUser } from "../../controllers/user.signup.controller.js";
import { signinUser } from "../../controllers/user.siginin.controller.js";
import { forgotPassword } from "../../controllers/forgotPassword.controller.js";
import { resetPassword } from "../../controllers/resetPassword.controller.js";
const router = express.Router();

router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password",resetPassword);

export default router;