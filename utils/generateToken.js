// jwt
const jwt = require("jsonwebtoken");

// Configs
const configs = require("../configs");

module.exports = (payload) => {
  return jwt.sign(
    { id: payload.id, user_type: payload.user_type },
    configs.jwt.secret,
    {
      expiresIn: configs.jwt.expires_in,
    }
  );
};
