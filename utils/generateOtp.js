// Otp Generator
const otpGenerator = require("otp-generator");

// Bcrypt
const bcrypt = require("bcryptjs");

module.exports = () => {
  // Generate Otp
  let sendOtp = otpGenerator.generate(5, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  // Hash or Encrypt the Otp before saving it to DB
  const hashedOtp = bcrypt.hashSync(sendOtp, 12);

  return { sendOtp, hashedOtp };
};
