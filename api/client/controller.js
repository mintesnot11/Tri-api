// Client
const Client = require("./dal");

// Otp
const Otp = require("../otp/dal");

// App Error
const AppError = require("../../utils/appError");

// Generate token
const generateToken = require("../../utils/generateToken");

// Generate pin reset otp
const generatePinResetOtp = require("../../utils/generateResetOtp");

// Cloudinary
const cloudinary = require("../../utils/cloudinary");

// Configs
const configs = require("../../configs");

// Folder names
const folderNames = require("../../utils/folderNames");

// Crypto
const crypto = require("crypto");

// Sign up
exports.signUp = {
  checkClient: async (req, res, next) => {
    try {
      // Get body
      const {
        first_name,
        last_name,
        phone_number,
        address,
        pin,
        pin_confirm,
        accept_policy,
      } = req.value;

      // Check if there is a user verified
      const otp = await Otp.getOtpByPhoneNumber(phone_number);
      if (!otp)
        return next(
          new AppError("Unfinished account creation. Please start again", 400)
        );

      // Check if the otp is verified
      if (otp.otp_status !== "Verified")
        return next(
          new AppError(
            "You do not verify your verification code. Please verify it",
            400
          )
        );

      req.data = {
        first_name,
        last_name,
        phone_number,
        address,
        pin,
        pin_confirm,
        accept_policy,
      };

      next();
    } catch (error) {
      next(error);
    }
  },
  deleteOtps: async (req, res, next) => {
    try {
      // Phone number
      const phone_number = req.data.phone_number;
      await Otp.deleteOtpsByPhoneNumber(phone_number);
      next();
    } catch (error) {
      next(error);
    }
  },
  createClientAndRespond: async (req, res, next) => {
    try {
      const data = req.data;

      // Create client
      const newClient = await Client.createClient(data);

      // Token
      const token = generateToken({ id: newClient._id, user_type: "client" });

      // Respond
      res.status(200).json({
        status: "SUCCESS",
        message: "You have created your Tri account successfully. Enjoy!",
        data: {
          client: newClient,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  },
};

// Client login
exports.clientLogin = async (req, res, next) => {
  try {
    // Get body
    const { phone_number, pin } = req.value;

    // Get client
    const client = await Client.getClientByPhoneNumber(phone_number);
    if (!client || !client.checkPin({ candidatePin: pin, pin: client.pin }))
      return next(new AppError("Invalid phone number or pin", 400));

    // Token
    const token = generateToken({ id: client._id, user_type: "client" });
    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: "You have successfully logged in",
      data: {
        client,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Get all clients
exports.getAllClients = async (req, res, next) => {
  try {
    const clients = await Client.getAllClients(req.query);

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      results: clients.length,
      data: {
        clients,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a single client
exports.getClient = async (req, res, next) => {
  try {
    const client = await Client.getClient(req.params.id);
    if (!client)
      return next(
        new AppError("There is no client with the specified id", 400)
      );

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      data: {
        client,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update client profile
exports.updateClientProfile = async (req, res, next) => {
  try {
    // Get body
    const { first_name, last_name, phone_number, address } = req.body;

    // Update client profile
    const client = await Client.updateClientProfile({
      data: { first_name, last_name, phone_number, address },
      id: req.user._id,
    });

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: "You have updated your profile successfully",
      data: {
        client,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update pin for client
exports.updatePin = async (req, res, next) => {
  try {
    // Get body
    const { current_pin, pin, pin_confirm } = req.value;

    // Get the client
    const client = await Client.getClient(req.user._id);

    // Check password
    if (!client.checkPin({ candidatePin: current_pin, pin: client.pin }))
      return next(
        new AppError("Invalid current pin. Please use the correct one", 400)
      );

    // Update
    await Client.updatePin({ data: { pin, pin_confirm }, id: req.user._id });

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: "You have successfully updated your pin. Please login",
      data: {
        client: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Forgot pin
exports.forgotPin = {
  checkClient: async (req, res, next) => {
    try {
      // Get body
      const phone_number = req.body.phone_number;

      // Check if all required fields exists
      if (!phone_number)
        return next(new AppError("Please provide your phone number", 400));

      // Get client
      const client = await Client.getClientByPhoneNumber(phone_number);
      if (!client)
        return next(
          new AppError(
            "There is account created using this phone number. Please sign up.",
            400
          )
        );

      req.data = { phone_number, client };
      next();
    } catch (error) {
      next(error);
    }
  },
  resetOtp: async (req, res, next) => {
    try {
      // Check pin reset otp count
      let client = req.data.client;

      // Reset pin reset count to zero
      if (
        client.pin_reset_otp_created &&
        client.pin_reset_otp_created.getTime() + 1 * 60 * 1000 < Date.now()
      ) {
        // Reverse reset pin to default
        client = await Client.reverseResetPinToDefault(client.phone_number);
      } else {
        if (client.pin_reset_otp_count >= 5) {
          // Check the last otp request
          if (
            client.pin_reset_otp_created.getTime() + 1 * 60 * 1000 >
            Date.now()
          ) {
            return next(
              new AppError(
                "You have requested multiple pin reset otps. Please try again after an hour.",
                400
              )
            );
          } else {
            // Reverse reset pin to default
            client = await Client.reverseResetPinToDefault(client.phone_number);
          }
        }
      }

      // Generate otp
      const { sendOtp, hashedOtp } = generatePinResetOtp();
      req.data.otp = { sendOtp, hashedOtp };
      req.data.client = client;

      next();
    } catch (error) {
      next(error);
    }
  },
  sendOtpAndRespond: async (req, res, next) => {
    try {
      // Get data
      const { otp, client } = req.data;

      // Pin reset otp expires
      const pin_reset_otp_expires = Date.now() + 5 * 60 * 1000;

      // Pin reset otp count
      const pin_reset_otp_count = client.pin_reset_otp_count + 1;

      // Pin reset otp created
      const pin_reset_otp_created = Date.now();

      // Update
      const clientData = await Client.forgotPin({
        data: {
          pin_reset_otp: otp.hashedOtp,
          pin_reset_otp_expires,
          pin_reset_otp_count,
          pin_reset_otp_created,
        },
        id: client._id,
      });

      // Send SMS

      // Respond
      res.status(200).json({
        status: "SUCCESS",
        message:
          "You have received a reset otp via SMS. It will expire within 1 minute.",
        data: {
          client: clientData,
        },
        otp: otp.sendOtp,
      });
    } catch (error) {
      next(error);
    }
  },
};

// Verify pin reset otp
exports.verifyPinResetOtp = async (req, res, next) => {
  try {
    // Get body
    const pin_reset_otp = req.body.pin_reset_otp;

    // Check if all required fields exists
    if (!pin_reset_otp)
      return next(new AppError("Please provide Pin Reset Otp", 400));

    // Hash the otp using crypto
    const hashedOtp = crypto
      .createHash("sha256")
      .update(pin_reset_otp)
      .digest("hex");

    // Get client and verify otp
    const client = await Client.getClientByPinResetOtp(hashedOtp);
    if (!client)
      return next(new AppError("Invalid or expired pin reset otp", 400));

    // Update is pin reset otp verified
    await Client.updatePinResetOtpVerified({
      data: { is_pin_reset_otp_verified: true },
      id: client._id,
    });

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message:
        "You have verified your pin reset otp successfully. Please proceed to the next step to reset your pin",
      data: {
        client,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Reset pin
exports.resetPin = async (req, res, next) => {
  try {
    // Get body
    const { pin, pin_confirm, client_id } = req.value;

    // Check if is pin reset otp is verified
    const client = await Client.getClient(client_id);
    if (!client)
      return next(
        new AppError("There is no client with the specified id", 400)
      );

    if (client.is_pin_reset_otp_verified) {
      // Reset
      await Client.resetPin({ data: { pin, pin_confirm }, id: client_id });
      await Client.reverseResetPinToDefault(client.phone_number);
    } else {
      return next(new AppError("Please verify your pin reset otp first", 400));
    }

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: "You have resetted your pin successfully. Please login",
      data: {
        client,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update client account status
exports.updateClientAccountStatus = {
  checkClient: async (req, res, next) => {
    try {
      const client = await Client.getClient(req.params.id);
      if (!client)
        return next(
          new AppError("There is no client with the specified id", 400)
        );

      req.client = client;
      next();
    } catch (error) {
      next(error);
    }
  },
  performUpdateAndRespond: async (req, res, next) => {
    try {
      // Account status
      let account_status = "";
      if (req.client.account_status === "Active") {
        account_status = "Inactive";
      } else {
        account_status = "Active";
      }

      const client = await Client.updateClientAccountStatus({
        account_status,
        id: req.client._id,
      });

      // Respond
      res.status(200).json({
        status: "SUCCESS",
        message: "Client account status is successfully updated",
        data: {
          client,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

// Update client profile picture
exports.updateClientProfilePicture = async (req, res, next) => {
  try {
    // Get body
    const image = req.file;
    if (!image) return next(new AppError("Please select an image", 400));

    const result = await cloudinary.uploader.upload(image.path, {
      folder: folderNames.client.profile_pictures,
    });
    req.public_id = result.public_id;

    // Update
    const client = await Client.updateProfilePicture({
      data: { image: result.secure_url, public_id: result.public_id },
      id: req.user._id,
    });

    //destory the previous profile image
    if (client.profile_picture.public_id) {
      await cloudinary.uploader.destroy(client.profile_picture.public_id);
    }

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: "Profile picture is successfully updated",
      data: {
        client,
      },
    });
  } catch (error) {
    next(new AppError(error, 400));
  }
};

// Delete client account
exports.deleteClientAccount = {
  checkClient: async (req, res, next) => {
    try {
      const client = await Client.getClient(req.params.id);
      if (!client)
        return next(
          new AppError("There is no client with the specified id", 400)
        );

      req.client = client;
      next();
    } catch (error) {
      next(error);
    }
  },
  performDeleteAndRespond: async (req, res, next) => {
    try {
      // Delete api key
      const delete_key = req.body.delete_key;

      // Check if there is a delete key
      if (!delete_key) return next(new AppError("Delete key is required", 400));

      if (configs.delete_key !== delete_key)
        return next(new AppError("Invalid delete key", 400));

      await Client.deleteClientAccount(req.client._id);

      // Respond
      res.status(200).json({
        status: "SUCCESS",
        message: "Client account is successfully removed from the system",
      });
    } catch (error) {
      next(error);
    }
  },
};
