// Winston
const { createLogger, transports, format } = require("winston");
const { printf, timestamp, combine } = format;

// Log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${level} ${timestamp} - ${message}`;
});

// Create logger
module.exports = createLogger({
  level: "debug",
  format: combine(timestamp(), logFormat),
  transports: [new transports.Console()],
});
