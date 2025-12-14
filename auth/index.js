// App Error
const AppError = require("../utils/appError");

// Authorization middleware
module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Access Denied", 400));
    }
    next();
  };
};
