// Crypto
const crypto = require("crypto");

// Otp Generator
const otpGenerator = require("otp-generator");

// Reset pin generator
module.exports = () => {
  // Generate Otp
  let sendOtp = otpGenerator.generate(5, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const hashedOtp = crypto.createHash("sha256").update(sendOtp).digest("hex");
  return { sendOtp, hashedOtp };
};
