// Event Type
const EventType = require("./dal");

// App Error
const AppError = require("../../utils/appError");

// Configs
const configs = require("../../configs");

// Create an event type
exports.createEventType = async (req, res, next) => {
  try {
    // Get body
    const { name, description } = req.value;

    // Create
    const newEventType = await EventType.createEventType({ name, description });

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: "New event type is successfully created",
      data: {
        eventType: newEventType,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all event types
exports.getAllEventTypes = async (req, res, next) => {
  try {
    const eventTypes = await EventType.getAllEventTypes(req.query);

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      results: eventTypes.length,
      data: {
        eventTypes,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get an event type
exports.getEventType = async (req, res, next) => {
  try {
    const eventType = await EventType.getEventType(req.params.id);
    if (!eventType)
      return next(
        new AppError("There is no event type with the specified id", 400)
      );

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      data: {
        eventType,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update event type
exports.updateEventType = {
  checkEventType: async (req, res, next) => {
    try {
      const eventType = await EventType.getEventType(req.params.id);
      if (!eventType)
        return next(
          new AppError("There is no event type with the specified id", 400)
        );
      next();
    } catch (error) {
      next(error);
    }
  },
  performUpdateAndRespond: async (req, res, next) => {
    try {
      // Get body
      const { name, description } = req.body;
      const eventType = await EventType.updateEventType({
        data: { name, description },
        id: req.params.id,
      });

      // Respond
      res.status(200).json({
        status: "SUCCESS",
        message: "Event type is successfully updated",
        data: {
          eventType,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

// Update event type status
exports.updateEventTypeStatus = {
  checkEventType: async (req, res, next) => {
    try {
      const eventType = await EventType.getEventType(req.params.id);
      if (!eventType)
        return next(
          new AppError("There is no event type with the specified id", 400)
        );
      req.eventType = eventType;
      next();
    } catch (error) {
      next(error);
    }
  },
  performUpdateAndRespond: async (req, res, next) => {
    try {
      // Status
      let status = req.eventType.status;
      if (status === "Active") {
        status = "Inactive";
      } else {
        status = "Active";
      }

      // Update
      const eventType = await EventType.updateEventTypeStatus({
        status,
        id: req.params.id,
      });

      // Respond
      res.status(200).json({
        status: "SUCCESS",
        message: "Event type status is successfully updated",
        data: {
          eventType,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

// Delete an event type
exports.deleteEventType = {
  checkEventType: async (req, res, next) => {
    try {
      const eventType = await EventType.getEventType(req.params.id);
      if (!eventType)
        return next(
          new AppError("There is no event type with the specified id", 400)
        );
      next();
    } catch (error) {
      next(error);
    }
  },
  // Check if there are events created using this event type
  performDeletionAndRespond: async (req, res, next) => {
    try {
      await EventType.deleteEventType(req.params.id);

      // Respond
      res.status(200).json({
        status: "SUCCESS",
        message: "The event type is successfully deleted",
      });
    } catch (error) {
      next(error);
    }
  },
};

// Delete all event types
exports.deleteAllEventTypes = async (req, res, next) => {
  try {
    // Get body
    const delete_key = req.body.delete_key;
    if (!delete_key)
      return next(new AppError("Please provide the delete key", 400));

    // Check delete key
    if (delete_key !== configs.delete_key)
      return next(new AppError("Invalid delete key", 400));

    // Check if there is an event created using this event type

    // Delete
    await EventType.deleteAllEventTypes();

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: "All event types are successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};
