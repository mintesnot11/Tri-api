// Multer
const multer = require("multer");

// Uploader
module.exports = multer({
  storage: multer.diskStorage({}),
});
