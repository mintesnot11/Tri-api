// Express
const express = require("express");

// App
const app = express();

// Morgan
const morgan = require("morgan");

// Compression
const compression = require("compression");

// Custom modules
const configs = require("../configs");
const geh = require("../geh");
const AppError = require("../utils/appError");
const apiKey = require("../utils/apiKey");

// Compression
app.use(compression());

// Use Security middlewares

// Use morgan
if (configs.env === "development") app.use(morgan("tiny"));

// Use built in express middlewares
app.use(express.json({}));
app.use(express.urlencoded({ extended: false }));

// Use routers
const adminRouter = require("../api/admin/router");
const otpRouter = require("../api/otp/router");
const clientRouter = require("../api/client/router");
const eventTypeRouter = require("../api/event_type/router");
const adRouter = require("../api/advertisement/router");

app.use(apiKey);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/otp", otpRouter);
app.use("/api/v1/client", clientRouter);
app.use("/api/v1/eventtype", eventTypeRouter);
app.use("/api/v1/ad", adRouter);

// Handle URL which does not exists
app.use("*", (req, res, next) => {
  return next(
    new AppError(
      `Unknown url - ${req.protocol}:${req.get("host")}${req.originalUrl}`,
      404
    )
  );
});

// Use GEH
app.use(geh);

// Export app
module.exports = app;
