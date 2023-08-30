import express from "express";
import {
  forgotPasswordValidation,
  loginValidation,
  logoutValidation,
  refreshTokensValidation,
  registerValidation,
  resetPasswordValidation,
  ssoLoginValidation
} from "../../validations/auth.validation";
import { validate } from "../../middlewares/middleware";
import AuthController from "../../app/auth/auth.controller";
import { auth } from "../../middlewares/auth";

const router = express.Router();
/**
 *  CUSTOMER
 * **/
router.post("/register", validate(registerValidation), AuthController.register);
router.post("/login", validate(loginValidation), AuthController.login);
router.post("/logout", validate(logoutValidation), AuthController.logout);
router.post(
  "/refresh-tokens",
  validate(refreshTokensValidation),
  AuthController.refreshTokens
);
router.post(
  "/forgot-password",
  validate(forgotPasswordValidation),
  AuthController.forgotPassword
);
router.post(
  "/reset-password",
  validate(resetPasswordValidation),
  AuthController.resetPassword
);
// router.post('/send-verification-email', auth, AuthController.sendVerificationEmail);
// router.post('/verify-email', validate(authValidation.verifyEmail), AuthController.verifyEmail);


/**
 *  ADMIN
 * **/


export default router;
