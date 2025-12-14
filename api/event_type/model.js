// Mongoose
const mongoose = require("mongoose");

// Event type schema
const eventTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Event type name is required"],
      unique: true,
      maxlength: [100, "Event type name can not exceed 100 characters"],
      minlength: [1, "Event type name can not be less than 1 character"],
    },
    description: {
      type: String,
      required: [true, "Description for the event type name is required"],
      maxlength: [500, "Event type description can not exceed 500 characters"],
      minlength: [
        5,
        "Event type description can not be less than 5 characters",
      ],
    },
    status: {
      type: String,
      default: "Active",
      enum: {
        values: ["Active", "Inactive"],
        message: "Unknown or invalid status",
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

// Event type model
const EventType = mongoose.model("EventType", eventTypeSchema);

// Export Event type model
module.exports = EventType;
