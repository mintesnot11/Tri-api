// Express
const express = require("express");

// Router
const router = express.Router();

// Protect
const protect = require("../../protect");

// Auth
const auth = require("../../auth");

// Uploader
const uploader = require("../../utils/fileUploader");

// Validator
const validator = require("../../utils/validator");

// Validation Schemas
const {
  signupSchema,
  clientLoginSchema,
  updatePinSchema,
  pinResetSchema,
} = require("./validation_schema");

// Client controller
const {
  signUp,
  clientLogin,
  getClient,
  updateClientProfile,
  updatePin,
  forgotPin,
  verifyPinResetOtp,
  resetPin,
  getAllClients,
  updateClientAccountStatus,
  updateClientProfilePicture,
  deleteClientAccount,
} = require("./controller");

router.post(
  "/signup",
  validator(signupSchema),
  signUp.checkClient,
  signUp.createClientAndRespond
);
router.post("/login", validator(clientLoginSchema), clientLogin);
router.post(
  "/forgotpin",
  forgotPin.checkClient,
  forgotPin.resetOtp,
  forgotPin.sendOtpAndRespond
);
router.post("/verifypin", verifyPinResetOtp);
router.patch("/resetpin", validator(pinResetSchema), resetPin);
router.patch(
  "/pin",
  protect,
  auth("Client"),
  validator(updatePinSchema),
  updatePin
);
router.patch(
  "/profile",
  protect,
  auth("Owner", "Super-admin", "Admin", "Client"),
  updateClientProfile
);
router.patch(
  "/profilepicture",
  protect,
  auth("Client"),
  uploader.single("image"),
  updateClientProfilePicture
);
router.patch(
  "/:id/status",
  protect,
  auth("Owner", "Super-admin"),
  updateClientAccountStatus.checkClient,
  updateClientAccountStatus.performUpdateAndRespond
);
router
  .route("/")
  .get(protect, auth("Owner", "Super-admin", "Admin"), getAllClients);

router
  .route("/:id")
  .get(protect, auth("Owner", "Super-admin", "Admin", "Client"), getClient)
  .delete(
    protect,
    auth("Owner", "Super-admin"),
    deleteClientAccount.checkClient,
    deleteClientAccount.performDeleteAndRespond
  );

// Export router
module.exports = router;
