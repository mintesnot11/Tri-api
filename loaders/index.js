// Http
const http = require("http");

// Logger
const logger = require("../utils/logger");

// App
const app = require("./app");

// DB Connection
const db_connection = require("./startDB");

// server
module.exports = () => {
  // Create a server
  const server = http.createServer(app);

  // Port
  const port = process.env.PORT || 3000;

  // Listen on the server
  server.listen(port, () => {
    logger.dev.info(`Listening on ${port}...`);
  });

  // Majestic close
  process.on("SIGINT", () => {
    // Close the server
    server.close(() => {
      logger.dev.info("Server is closing");
    });
    // Close db
    db_connection.close();
  });
};
