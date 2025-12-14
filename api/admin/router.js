// Express
const express = require("express");

// Router
const router = express.Router();

// Admin Controller
const {
  createAdmin,
  getAllAdmins,
  getAdmin,
  updateAdminRole,
  updateDefaultPassword,
  resetAdminPassword,
  adminLogin,
  updateAdminAccountStatus,
  updateAdminProfile,
  updatePassword,
  deleteAdmin,
  deleteAllAdmins,
} = require("./controller");

// Protect
const protect = require("../../protect");

// Auth
const auth = require("../../auth");

// Validator
const validator = require("../../utils/validator");

// Validation Schema
const {
  createAdminSchema,
  adminLoginSchema,
  updateDefaultPasswordSchema,
  resetAdminPasswordSchema,
  updateAdminRoleSchema,
  updateAdminPasswordSchema,
} = require("./validation_schema");

router.post("/login", validator(adminLoginSchema), adminLogin);

router
  .route("/")
  .post(
    protect,
    auth("Owner", "Super-admin"),
    validator(createAdminSchema),
    createAdmin.checkAccounts,
    createAdmin.performCreationAndRespond
  )
  .get(protect, auth("Owner", "Super-admin", "Admin"), getAllAdmins)
  .delete(protect, auth("Owner", "Super-admin"), deleteAllAdmins);

router
  .route("/:id")
  .get(protect, auth("Owner", "Super-admin", "Admin"), getAdmin)
  .delete(
    protect,
    auth("Owner", "Super-admin"),
    deleteAdmin.checkAdmin,
    deleteAdmin.checkAdminAccounts,
    deleteAdmin.performDeletionAndRespond
  );

router.patch(
  "/:id/defaultpassword",
  validator(updateDefaultPasswordSchema),
  updateDefaultPassword.checkAdmin,
  updateDefaultPassword.checkPassword,
  updateDefaultPassword.performUpdateAndRespond
);

router.patch(
  "/resetpassword",
  protect,
  auth("Owner", "Super-admin"),
  validator(resetAdminPasswordSchema),
  resetAdminPassword.checkAdmin,
  resetAdminPassword.performUpdateAndRespond
);

router.patch(
  "/:id/adminrole",
  protect,
  auth("Owner", "Super-admin"),
  validator(updateAdminRoleSchema),
  updateAdminRole.checkAdmin,
  updateAdminRole.performUpdateAndRespond
);

router.patch(
  "/:id/accountstatus",
  protect,
  auth("Owner", "Super-admin"),
  updateAdminAccountStatus.checkAdmin,
  updateAdminAccountStatus.performUpdateAndRespond
);

router.patch(
  "/profile",
  protect,
  auth("Owner", "Super-admin", "Admin"),
  updateAdminProfile
);

router.patch(
  "/password",
  protect,
  auth("Owner", "Super-admin", "Admin"),
  validator(updateAdminPasswordSchema),
  updatePassword.checkAdmin,
  updatePassword.performUpdateAndRespond
);

// Export router
module.exports = router;
