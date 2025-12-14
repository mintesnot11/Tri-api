// Express
const express = require("express");

// Router
const router = express.Router();

// Event type controller
const {
  createEventType,
  getAllEventTypes,
  getEventType,
  updateEventType,
  updateEventTypeStatus,
  deleteEventType,
  deleteAllEventTypes,
} = require("./controller");

// Protect
const protect = require("../../protect");

// Auth
const auth = require("../../auth");

// Validator
const validator = require("../../utils/validator");

// Validation Schema
const { createEventSchema } = require("./validation_schema");

router
  .route("/")
  .post(
    protect,
    auth("Owner", "Super-admin"),
    validator(createEventSchema),
    createEventType
  )
  .get(
    protect,
    auth("Owner", "Super-admin", "Admin", "Client"),
    getAllEventTypes
  )
  .delete(protect, auth("Owner", "Super-admin"), deleteAllEventTypes);

router
  .route("/:id")
  .get(protect, auth("Owner", "Super-admin", "Admin", "Client"), getEventType)
  .patch(
    protect,
    auth("Owner", "Super-admin"),
    updateEventType.checkEventType,
    updateEventType.performUpdateAndRespond
  )
  .delete(
    protect,
    auth("Owner", "Super-admin"),
    deleteEventType.checkEventType,
    deleteEventType.performDeletionAndRespond
  );

router.patch(
  "/:id/status",
  protect,
  auth("Owner", "Super-admin"),
  updateEventTypeStatus.checkEventType,
  updateEventTypeStatus.performUpdateAndRespond
);

// Export router
module.exports = router;
