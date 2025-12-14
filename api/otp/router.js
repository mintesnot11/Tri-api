// Express
const express = require("express");

// Router
const router = express.Router();

// Otp controller
const { createOtp, verifyOtp } = require("./controller");

// Validator
const validator = require("../../utils/validator");

// Validation Schemas
const { sendOtpSchema, verifyOtpSchema } = require("./validation_schema");

router.post(
  "/sendotp",
  validator(sendOtpSchema),
  createOtp.checkUser,
  createOtp.checkOtp,
  createOtp.generateAndSendOtp
);

router.post(
  "/verifyotp",
  validator(verifyOtpSchema),
  verifyOtp.checkOtp,
  verifyOtp.updateOtp,
  verifyOtp.deleteNotVerifiedOtps,
  verifyOtp.respond
);

// Export router
module.exports = router;
