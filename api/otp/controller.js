// Otp
const Otp = require("./dal");

// Client
const Client = require("../client/dal");

// App Error
const AppError = require("../../utils/appError");

// Generate otp
const generateOtp = require("../../utils/generateOtp");

// Bcrypt
const bcrypt = require("bcryptjs");

// Create an otp
exports.createOtp = {
  checkUser: async (req, res, next) => {
    try {
      // Get body
      const { first_name, last_name, phone_number, address } = req.value;

      // Check if there is a client
      const client = await Client.getClientByPhoneNumber(phone_number);
      if (client)
        return next(new AppError("You already have an account on Tri", 400));

      req.data = { first_name, last_name, phone_number, address };

      next();
    } catch (error) {
      next(error);
    }
  },
  checkOtp: async (req, res, next) => {
    try {
      // Get otps using user phone number
      const phone_number = req.data.phone_number;

      // Otps
      const otps = await Otp.getAllOtpsByPhoneNumber(phone_number);
      const otpCounts = otps.length;

      // Check if the client request otp for more than 5 times
      if (otpCounts >= 5) {
        // Get the latest otp
        const latestOtp = otps[otps.length - 1];

        // Set expire date
        if (latestOtp.createdAt.getTime() + 1 * 60 * 1000 > Date.now()) {
          return next(
            new AppError(
              "You have requested multiple otps. Please try again after 1 minute",
              400
            )
          );
        } else {
          // Delete existing otps
          await Otp.deleteOtpsByPhoneNumber(phone_number);
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  generateAndSendOtp: async (req, res, next) => {
    try {
      // Get request body data
      const data = req.data;

      // Generate otp
      const { sendOtp, hashedOtp } = generateOtp();

      // Create otp
      const newOtp = await Otp.createOtp({
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        address: data.address,
        otp: hashedOtp,
      });

      // Send the hashed otp using SMS

      // Respond
      res.status(200).json({
        status: "SUCCESS",
        message: "Otp is successfully sent to your phone",
        data: {
          otp: newOtp,
        },
        otp: sendOtp,
      });
    } catch (error) {
      next(error);
    }
  },
};

// Verify Otp
exports.verifyOtp = {
  checkOtp: async (req, res, next) => {
    try {
      // Get body
      const { phone_number, otp } = req.value;

      // Check if there are otps with the specified phone number
      const otps = await Otp.getAllOtpsByPhoneNumber(phone_number);
      if (otps.length === 0)
        return next(
          new AppError(
            "There are no otps sent to the specified phone number",
            400
          )
        );

      // Check if the otp expires
      const latestOtp = otps[otps.length - 1];
      if (latestOtp.createdAt.getTime() + 2 * 60 * 1000 < Date.now()) {
        return next(
          new AppError("Verification code expired. Please try again", 400)
        );
      }

      // Compare the otp sent with the hashed otp
      if (!bcrypt.compareSync(otp, latestOtp.otp))
        return next(
          new AppError(
            "Invalid verification code. Please use the correct one",
            400
          )
        );

      req.data = {
        phone_number,
        otp,
        latestOtp,
      };

      next();
    } catch (error) {
      next(error);
    }
  },
  updateOtp: async (req, res, next) => {
    try {
      // Latest otp
      const latestOtp = req.data.latestOtp;

      // Update otp
      latestOtp.otp_status = "Verified";
      await latestOtp.save();

      next();
    } catch (error) {
      next(error);
    }
  },
  deleteNotVerifiedOtps: async (req, res, next) => {
    try {
      // Phone number
      const phone_number = req.data.phone_number;

      // Delete
      await Otp.deleteNotVerifiedOtps(phone_number);

      next();
    } catch (error) {
      next(error);
    }
  },
  respond: async (req, res, next) => {
    try {
      // Latest otp
      const latestOtp = req.data.latestOtp;

      // Respond
      res.status(200).json({
        status: "SUCCESS",
        message: "Your account is successfully verified",
        data: {
          otp: latestOtp,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
