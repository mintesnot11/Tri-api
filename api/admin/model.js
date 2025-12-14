// Mongoose
const mongoose = require("mongoose");

// Validator
const validator = require("validator");

// Bcrypt
const bcrypt = require("bcryptjs");

// Admin Schema
const adminSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "First name of the admin is required"],
      maxlength: [
        1000,
        "First name of the admin can not exceed 1000 characters",
      ],
      minlength: [
        1,
        "First name of the admin can not be less than 1 character",
      ],
    },
    last_name: {
      type: String,
      required: [true, "Last name of the admin is required"],
      maxlength: [
        1000,
        "Last name of the admin can not exceed 1000 characters",
      ],
      minlength: [1, "Last name of the admin can not be less than 1 character"],
    },
    phone_number: {
      type: String,
      required: [true, "Phone number of the admin is required"],
      maxlength: [20, "Phone number of the admin can not exceed 20 characters"],
      minlength: [
        10,
        "Phone number of the admin can not be less than 20 characters",
      ],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: {
        validator: validator.isEmail,
        message: "Invalid email address",
      },
      unique: true,
    },
    role: {
      type: String,
      required: [true, "Role of the admin is required"],
      enum: {
        values: ["Owner", "Super-admin", "Admin"],
        message: "Unknown or invalid role",
      },
    },
    password: {
      type: String,
      required: [true, "Password of the admin is required"],
      minlength: [8, "Password can not be less than 8 characters"],
    },
    password_confirm: {
      type: String,
      required: [true, "Password confirm is required"],
      validate: {
        validator: function (value) {
          return this.password === value;
        },
        message: "Password and Password Confirm should be the same",
      },
    },
    default_password: {
      type: String,
    },
    is_default_password: {
      type: Boolean,
      default: true,
    },
    count_default_password_update: {
      type: Number,
      default: 0,
      min: [0, "Default password update count can not be less than 0"],
    },
    password_changed_at: Date,
    account_status: {
      type: String,
      default: "Active",
      enum: {
        values: ["Active", "Inactive"],
        message: "Unknown or invalid account status",
      },
    },
    first_account: Boolean,
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

// Hash the password
adminSchema.pre("save", function (next) {
  if (!this.isModified("password")) next();
  this.password = bcrypt.hashSync(this.password, 12);
  this.password_confirm = undefined;
  next();
});

adminSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.password_changed_at = Date.now();
  next();
});

// Check password
adminSchema.methods.checkPassword = function ({ candidatePassword, password }) {
  return bcrypt.compareSync(candidatePassword, password);
};

// Check password changed at
adminSchema.methods.checkPasswordChangedAt = function (iat) {
  if (this.password_changed_at) {
    return iat < parseInt(this.password_changed_at.getTime() / 1000, 10);
  }
  return false;
};

// Admin model
const Admin = mongoose.model("Admin", adminSchema);

// Export Admin model
module.exports = Admin;
