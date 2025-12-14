const { cloudinary } = require("../configs");
const cloudinaryUploader = require("cloudinary").v2;

// Configure cloudinary
cloudinaryUploader.config({
  cloud_name: cloudinary.cloud_name,
  api_key: cloudinary.api_key,
  api_secret: cloudinary.api_secret,
  secure: true,
});

module.exports = cloudinaryUploader;
