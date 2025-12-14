// Mongoose
const mongoose = require("mongoose");

// Otp Schema
const otpSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "First name of the client is required"],
      maxlength: [
        1000,
        "First name of the client can not exceed 1000 characters",
      ],
      minlength: [
        1,
        "First name of the client can not be less than 1 character",
      ],
    },
    last_name: {
      type: String,
      required: [true, "Last name of the client is required"],
      maxlength: [
        1000,
        "Last name of the client can not exceed 1000 characters",
      ],
      minlength: [
        1,
        "Last name of the client can not be less than 1 character",
      ],
    },
    phone_number: {
      type: String,
      required: [true, "Phone number of the client is required"],
      maxlength: [
        20,
        "Phone number of the client can not exceed 20 characters",
      ],
      minlength: [
        10,
        "Phone number of the client can not be less than 20 characters",
      ],
    },
    address: {
      type: String,
      maxlength: [1000, "Address of the client can not exceed 1000 characters"],
      minlength: [1, "Address of the client can not be less than 1 character"],
    },
    otp: {
      type: String,
      required: [true, "Otp is required"],
    },
    otp_status: {
      type: String,
      default: "Not-verified",
      enum: {
        values: ["Verified", "Not-verified"],
        message: "Unknown status for Otp",
      },
    },
  },
  {
    writeConcern: {
      w: "majority",
      j: true,
    },
    timestamps: true,
  }
);

// Expire date for the otp
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 120 });

// Otp model
const Otp = mongoose.model("Otp", otpSchema);

// Export Otp model
module.exports = Otp;
