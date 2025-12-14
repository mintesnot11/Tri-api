// Mongoose
const mongoose = require("mongoose");

// Configs
const configs = require("../configs");

// Logger
const logger = require("../utils/logger");

// Connect with DB
mongoose
  .connect(configs.db.remote)
  .then((conn) => {
    logger.dev.info("Successfully connected");
  })
  .catch((error) => {
    logger.dev.error(error.message);
  });

// DB Connection
const db_connection = mongoose.connection;

// Handle disconnection
db_connection.on("disconnected", () => {
  logger.dev.error("DB is disconnected");
});

// Handle error
db_connection.on("error", (error) => {
  logger.dev.error(error.message);
});

// Export db connection
module.exports = db_connection;
