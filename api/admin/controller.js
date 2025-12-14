// Admin
const Admin = require("./dal");

// App Error
const AppError = require("../../utils/appError");

// Generate password
const passwordGenerator = require("../../utils/generatePassword");

// Generate token
const generateToken = require("../../utils/generateToken");

// Configs
const configs = require("../../configs");

// Create an admin
exports.createAdmin = {
  checkAccounts: async (req, res, next) => {
    try {
      // Admins
      const admins = await Admin.getAllAdmins(null);
      let first_account = false;
      if (admins.length === 0) {
        first_account = true;
      }
      console.log(req.value);
      req.value.first_account = first_account;

      next();
    } catch (error) {
      next(error);
    }
  },
  performCreationAndRespond: async (req, res, next) => {
    try {
      // Body
      const data = req.value;

      // Default password

      data.password = passwordGenerator();
      data.password_confirm = data.password;
      data.default_password = data.password;

      // Create new admin
      const newAdmin = await Admin.createAdmin(data);

      // Respond
      res.status(200).json({
        status: "SUCCESS",
        message: "New admin is successfully created",
        data: {
          admin: newAdmin,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

// Get all admins
exports.getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.getAllAdmins(req.query);

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      results: admins.length,
      data: {
        admins,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a single admin
exports.getAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.getAdmin(req.params.id);
    if (!admin)
      return next(new AppError("There is no admin with the specified id", 400));

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      data: {
        admin,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin Login
exports.adminLogin = async (req, res, next) => {
  try {
    // Get body
    const { email_or_phone, password } = req.value;

    // Get the admin
    const admin = await Admin.adminLogin({ email_or_phone });

    // Check if there is an admin and check password
    if (
      !admin ||
      !admin.checkPassword({
        candidatePassword: password,
        password: admin.password,
      })
    ) {
      return next(
        new AppError("Invalid Email / Phone number or Password", 400)
      );
    }

    // Generate token
    const token = generateToken({ id: admin._id, user_type: "admin" });

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: "You have successfully logged in.",
      data: {
        admin,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Update default password
exports.updateDefaultPassword = {
  checkAdmin: async (req, res, next) => {
    try {
      const admin = await Admin.getAdmin(req.params.id);
      if (!admin)
        return next(
          new AppError("There is no admin with the specified id", 400)
        );

      // Check if the default password is already updated
      if (!admin.is_default_password)
        return next(
          new AppError("You have already updated your default password.", 400)
        );

      req.admin = admin;

      next();
    } catch (error) {
      next(error);
    }
  },
  checkPassword: async (req, res, next) => {
    try {
      // Admin data
      const adminData = req.admin;

      // Get body
      const { default_password, password, password_confirm } = req.value;

      // Check the password
      if (
        !adminData.checkPassword({
          candidatePassword: default_password,
          password: req.admin.password,
        })
      ) {
        // Update count default password update
        let count_default_password_update = 0;

        if (adminData.count_default_password_update) {
          count_default_password_update =
            adminData.count_default_password_update;
        }

        // Check default password number
        if (adminData.count_default_password_update >= 5)
          return next(
            new AppError(
              "You have tried to update the default password multiple times. We have suspected unusual acitivity. Please contact the super admin or owner to reset your password.",
              400
            )
          );

        await Admin.updateCountDefaultPassword({
          count_default_password_update,
          id: adminData._id,
        });

        return next(
          new AppError(
            "Incorrect default password. Please provide the correct default password",
            400
          )
        );
      }

      // Check default password number
      if (adminData.count_default_password_update >= 5)
        return next(
          new AppError(
            "You have tried to update the default password multiple times. We have suspected unusual acitivity. Please contact the super admin or owner to reset your password.",
            400
          )
        );

      req.data = { password, password_confirm };

      next();
    } catch (error) {
      next(error);
    }
  },
  performUpdateAndRespond: async (req, res, next) => {
    try {
      // Admin data
      const adminData = req.admin;

      const admin = await Admin.updateDefaultPassword({
        data: {
          password: req.data.password,
          password_confirm: req.data.password_confirm,
        },
        id: adminData._id,
      });

      // Respond
      res.status(200).json({
        status: "SUCCESS",
        message:
          "You have updated your default password successfully. Please login.",
        data: {
          admin,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

// Reset admin password
exports.resetAdminPassword = {
  checkAdmin: async (req, res, next) => {
    try {
      // Get body
      const id = req.value.id;

      const admin = await Admin.getAdmin(id);
      if (!admin)
        return next(
          new AppError("There is no admin with the specified id", 400)
        );

      // Check if the admin is updating his or her own account status
      if (req.user.id === admin.id)
        return next(
          new AppError("You can not reset of your own account password.", 400)
        );

      req.admin = admin;

      next();
    } catch (error) {
      next(error);
    }
  },
  performUpdateAndRespond: async (req, res, next) => {
    try {
      // Admin data
      const adminData = req.admin;

      // Generate password
      const password = passwordGenerator();

      // Update
      await Admin.resetAdminPassword({
        data: {
          default_password: password,
          password,
          password_confirm: password,
        },
        id: adminData._id,
      });

      // Respond
      res.status(200).json({
        status: "SUCCESS",
        message: "Password is successfully resetted",
        data: {
          admin: adminData,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

// Update an admin role
exports.updateAdminRole = {
  checkAdmin: async (req, res, next) => {
    try {
      const admin = await Admin.getAdmin(req.params.id);
      if (!admin)
        return next(
          new AppError("There is no admin with the specified id", 400)
        );

      req.admin = admin;

      next();
    } catch (error) {
      next(error);
    }
  },
  performUpdateAndRespond: async (req, res, next) => {
    try {
      // Admin data
      const adminData = req.admin;

      // Get body
      const role = req.value.role;

      // Check if all required fields exists
      if (!role)
        return next(new AppError("Please fill all required fields", 400));

      // Update
      const admin = await Admin.updateAdminRole({ role, id: adminData._id });

      // Respond
      res.status(200).json({
        status: "SUCCESS",
        message: "Admin role is successfully updated",
        data: {
          admin,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

// Update admin account status
exports.updateAdminAccountStatus = {
  checkAdmin: async (req, res, next) => {
    try {
      const admin = await Admin.getAdmin(req.params.id);
      if (!admin)
        return next(
          new AppError("There is no admin with the specified id", 400)
        );

      // Check if the admin is updating his or her own account status
      if (req.user.id === admin.id)
        return next(
          new AppError(
            "You can not update account status of your own account.",
            400
          )
        );

      req.admin = admin;

      next();
    } catch (error) {
      next(error);
    }
  },
  performUpdateAndRespond: async (req, res, next) => {
    try {
      // Admin
      const adminData = req.admin;

      // Account status
      let account_status = adminData.account_status;
      if (adminData.account_status === "Active") {
        account_status = "Inactive";
      } else {
        account_status = "Active";
      }

      // Update
      const admin = await Admin.updateAdminStatus({
        account_status,
        id: adminData._id,
      });

      // Respond
      res.status(200).json({
        status: "SUCCESS",
        message: "Admin account status is successfully updated",
        data: {
          admin,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

// Update admin profile
exports.updateAdminProfile = async (req, res, next) => {
  try {
    // Get body
    const { first_name, last_name, email, phone_number } = req.body;

    // Update
    const admin = await Admin.updateAdminProfile({
      data: { first_name, last_name, email, phone_number },
      id: req.user._id,
    });

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: "You have successfully updated your profile.",
      data: {
        admin,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update password
exports.updatePassword = {
  checkAdmin: async (req, res, next) => {
    try {
      // Get admin
      const admin = await Admin.getAdmin(req.user._id);

      req.admin = admin;

      next();
    } catch (error) {
      next(error);
    }
  },
  performUpdateAndRespond: async (req, res, next) => {
    try {
      // Admin data
      const adminData = req.admin;

      // Get body
      const { current_password, password, password_confirm } = req.value;

      // Check password
      if (
        !adminData.checkPassword({
          candidatePassword: current_password,
          password: adminData.password,
        })
      )
        return next(new AppError("Incorrect current password", 400));

      // Update
      const admin = await Admin.updateAdminPassword({
        data: { password, password_confirm },
        id: adminData._id,
      });

      // Respond
      res.status(200).json({
        status: "SUCCESS",
        message: "You have updated your password successfully. Please login",
        data: {
          admin: adminData,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

// Delete an admin
exports.deleteAdmin = {
  checkAdmin: async (req, res, next) => {
    try {
      const admin = await Admin.getAdmin(req.params.id);
      if (!admin)
        return next(
          new AppError("There is no admin with the specified id", 400)
        );

      // Check if the admin is updating his or her own account status
      if (req.user.id === admin.id)
        return next(new AppError("You can not delete your own account.", 400));

      req.admin = admin;

      next();
    } catch (error) {
      next(error);
    }
  },
  checkAdminAccounts: async (req, res, next) => {
    try {
      // Admins
      const admins = await Admin.getAllAdmins(null);
      if (admins.length <= 1)
        return next(
          new AppError(
            "There is only account remained in the system. You can not perform the deletion",
            400
          )
        );
      next();
    } catch (error) {
      next(error);
    }
  },
  performDeletionAndRespond: async (req, res, next) => {
    try {
      // Admin data
      const adminData = req.admin;

      // Delete
      await Admin.deleteAdmin(adminData._id);

      // Respond
      res.status(200).json({
        status: "SUCCESS",
        message: "Admin account is successfully removed",
      });
    } catch (error) {
      next(error);
    }
  },
};

// Delete all admins
exports.deleteAllAdmins = async (req, res, next) => {
  try {
    // Get body
    const delete_key = req.body.delete_key;

    // Check if all required fields exists
    if (!delete_key) return next(new AppError("Delete key is required", 400));

    // Check if the delete key matches
    if (configs.delete_key !== delete_key)
      return next(new AppError("Invalid delete key", 400));

    // Delete
    await Admin.deleteAllAdmins();

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message:
        "All admins except for the first account are deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
