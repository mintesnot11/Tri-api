// Event Type Model
const EventTypeModel = require("./model");

// API Features
const APIFeatures = require("../../utils/apiFeatures");

// Event Type service
class EventType {
  // Create event type
  static async createEventType(data) {
    try {
      const newEventType = await EventTypeModel.create({
        name: data.name,
        description: data.description,
      });
      return newEventType;
    } catch (error) {
      throw error;
    }
  }

  // Get all event types
  static async getAllEventTypes(query) {
    try {
      const apiFeatures = new APIFeatures(EventTypeModel.find(), query)
        .filter()
        .sort()
        .project()
        .paginate();
      const eventTypes = await apiFeatures.query;
      return eventTypes;
    } catch (error) {
      throw error;
    }
  }

  // Get a single event type
  static async getEventType(id) {
    try {
      const eventType = await EventTypeModel.findById(id);
      return eventType;
    } catch (error) {
      throw error;
    }
  }

  // Update event type
  static async updateEventType({ data, id }) {
    try {
      const eventType = await EventTypeModel.findByIdAndUpdate(
        id,
        {
          name: data.name,
          description: data.description,
        },
        { runValidators: true, new: true }
      );
      return eventType;
    } catch (error) {
      throw error;
    }
  }

  // Update event type status
  static async updateEventTypeStatus({ status, id }) {
    try {
      const eventType = await EventTypeModel.findByIdAndUpdate(
        id,
        { status },
        { runValidators: true, new: true }
      );
      return eventType;
    } catch (error) {
      throw error;
    }
  }

  // Delete an event type
  static async deleteEventType(id) {
    try {
      await EventTypeModel.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete all event type
  static async deleteAllEventTypes() {
    try {
      await EventTypeModel.deleteMany({});
    } catch (error) {
      throw error;
    }
  }
}

// Export Event type
module.exports = EventType;
