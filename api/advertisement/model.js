// Mongoose
const mongoose = require("mongoose");

// Ad schema
const adSchema = new mongoose.Schema(
  {
    company_name: {
      type: String,
      required: [true, "Company name is required"],
      maxlength: [500, "Company name can not exceed 500 characters"],
      minlength: [1, "Company name can not be less than 1 character"],
    },
    expire_date: {
      type: Date,
      required: [true, "Expire date for the ad is required"],
    },
    is_expired: {
      type: Boolean,
      default: false,
    },
    image: {},
    spot_label: {
      type: String,
      required: [true, "Spot label is required"],
      enum: {
        values: ["Premium", "Platinium", "Gold"],
        message: "Unknown or invalid advertisement spot label",
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

module.exports = mongoose.model("Ad", adSchema);
