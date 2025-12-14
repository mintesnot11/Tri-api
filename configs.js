// Dotenv
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// Export env variables
module.exports = {
  env: process.env.NODE_ENV,
  db: {
    remote: process.env.DB_REMOTE,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
  },
  api_key: process.env.API_KEY,
  delete_key: process.env.DELETE_KEY,
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  ad: {
    max_size: 3,
  },
};
