// App Error
const AppError = require("../utils/appError");

// JWT
const jwt = require("jsonwebtoken");

// Admin
const Admin = require("../api/admin/dal");

// Client
const Client = require("../api/client/dal");

// Configs
const configs = require("../configs");

// Protect route
module.exports = async (req, res, next) => {
  try {
    // Token
    let token = "";

    // Get the token
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check the token
    if (!token) return next(new AppError("Please login.", 400));

    // Verify token
    const data = jwt.verify(token, configs.jwt.secret);

    // Check user
    // User
    let user = "";

    // Check user type
    if (data.user_type === "admin") {
      // Get the admin
      const admin = await Admin.getAdmin(data.id);
      if (!admin) return next(new AppError("Unknown user", 400));

      // Check default password
      if (admin.is_default_password === true)
        return next(
          new AppError(
            "Please update the default password. You will get access once you update the default password.",
            400
          )
        );

      // Check admin status
      if (admin.account_status !== "Active")
        return next(
          new AppError(
            "Your account is deactivated. Contact the super admin or owner.",
            400
          )
        );

      // Check if password is changed
      if (admin.checkPasswordChangedAt(data.iat)) {
        return next(
          new AppError(
            "You have recently changed your password. Please login",
            400
          )
        );
      }
      user = admin;
    } else if (data.user_type === "client") {
      // Get the client
      const client = await Client.getClient(data.id);
      if (!client) return next(new AppError("Unknown user", 400));

      // Check account status
      if (client.account_status === "Inactive")
        return next(
          new AppError(
            "You account is deactivated. Contact the owner of this product to activate your account.",
            400
          )
        );

      // Check the client changed pin
      if (client.checkPinChangedAt(data.iat)) {
        return next(
          new AppError("You have recently changed your pin. Please login", 400)
        );
      }

      user = client;
    }

    // Attach user on request object
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
