// Crypto
const crypto = require("crypto");

// Logger
const logger = require("../utils/logger");

// Generate an API key
const apiKey = crypto.createHash("sha256").digest("hex");
logger.dev.info(apiKey);
