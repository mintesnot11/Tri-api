// Mongoose
const mongoose = require("mongoose");

// Bcrypt
const bcrypt = require("bcryptjs");

// Client Schema
const clientSchema = new mongoose.Schema(
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
      unique: true,
    },
    address: {
      type: String,
      maxlength: [1000, "Address of the client can not exceed 1000 characters"],
      minlength: [1, "Address of the client can not be less than 1 character"],
    },
    role: {
      type: String,
      default: "Client",
    },
    pin: {
      type: String,
      required: [true, "Pin is required"],
      min: [4, "Pin of the client can not be less than 4 characters"],
      max: [4, "Pin of the client can not exceed 4 characters"],
    },
    pin_confirm: {
      type: String,
      required: [true, "Pin confirm is required"],
      validate: {
        validator: function (value) {
          return this.pin === value;
        },
        message: "Pin and Pin Confirm should be the same",
      },
    },
    pin_reset_otp: String,
    pin_reset_otp_expires: Date,
    pin_reset_otp_count: {
      type: Number,
      default: 0,
      min: [0, "Pin reset otp can not be less than 0"],
    },
    pin_reset_otp_created: Date,
    is_pin_reset_otp_verified: Boolean,
    pin_changed_at: Date,
    account_status: {
      type: String,
      default: "Active",
      enum: {
        values: ["Active", "Inactive"],
        message: "Unknown or invalid account status",
      },
    },
    accept_policy: {
      type: Boolean,
      default: false,
    },
    profile_picture: {},
  },
  {
    writeConcern: {
      w: "majority",
      j: true,
    },
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Hash the pin
clientSchema.pre("save", function (next) {
  if (!this.isModified("pin")) next();
  this.pin = bcrypt.hashSync(this.pin, 12);
  this.pin_confirm = undefined;
  next();
});

clientSchema.pre("save", function (next) {
  if (!this.isModified("pin") || this.isNew) next();
  this.pin_changed_at = Date.now();
  next();
});

// Compare password
clientSchema.methods.checkPin = function ({ candidatePin, pin }) {
  return bcrypt.compareSync(candidatePin, pin);
};

// Check pin changed at
clientSchema.methods.checkPinChangedAt = function (iat) {
  if (this.pin_changed_at) {
    return iat < parseInt(this.pin_changed_at.getTime() / 1000, 10);
  }
  return false;
};

// Client model
const Client = mongoose.model("Client", clientSchema);

// Export Client model
module.exports = Client;
