// Client model
const ClientModel = require("./model");

// API Features
const APIFeatures = require("../../utils/apiFeatures");

// Client service
class Client {
  // Create client
  static async createClient(data) {
    try {
      const newClient = await ClientModel.create({
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        address: data.address,
        pin: data.pin,
        pin_confirm: data.pin_confirm,
        accept_policy: data.accept_policy,
      });
      return newClient;
    } catch (error) {
      throw error;
    }
  }

  // Get all clients
  static async getAllClients(query) {
    try {
      const apiFeatures = new APIFeatures(ClientModel.find(), query)
        .filter()
        .sort()
        .project()
        .paginate();
      const clients = await apiFeatures.query;
      return clients;
    } catch (error) {
      throw error;
    }
  }

  // Get a single client
  static async getClient(id) {
    try {
      const client = await ClientModel.findById(id);
      return client;
    } catch (error) {
      throw error;
    }
  }

  // Get a client using phone number
  static async getClientByPhoneNumber(phone_number) {
    try {
      const client = await ClientModel.findOne({ phone_number });
      return client;
    } catch (error) {
      throw error;
    }
  }

  // Update client profile
  static async updateClientProfile({ data, id }) {
    try {
      const client = await ClientModel.findByIdAndUpdate(
        id,
        {
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
          address: data.address,
        },
        { runValidators: true, new: true }
      );
      return client;
    } catch (error) {
      throw error;
    }
  }

  // Update pin
  static async updatePin({ data, id }) {
    try {
      const client = await ClientModel.findById(id);
      client.pin = data.pin;
      client.pin_confirm = data.pin_confirm;
      await client.save();
    } catch (error) {
      throw error;
    }
  }

  // Forgot pin
  static async forgotPin({ data, id }) {
    try {
      const client = await ClientModel.findByIdAndUpdate(
        id,
        {
          pin_reset_otp: data.pin_reset_otp,
          pin_reset_otp_expires: data.pin_reset_otp_expires,
          pin_reset_otp_count: data.pin_reset_otp_count,
          pin_reset_otp_created: data.pin_reset_otp_created,
        },
        { runValidators: true, new: true }
      );
      return client;
    } catch (error) {
      throw error;
    }
  }

  // Reverse reset pin to default
  static async reverseResetPinToDefault(phone_number) {
    try {
      const client = await ClientModel.findOneAndUpdate(
        { phone_number },
        {
          pin_reset_otp: null,
          pin_reset_otp_count: 0,
          pin_reset_otp_expires: null,
          is_pin_reset_otp_verified: false,
        },
        { runValidators: true, new: true }
      );
      return client;
    } catch (error) {
      throw error;
    }
  }

  // Reset pin
  static async resetPin({ data, id }) {
    try {
      const client = await ClientModel.findById(id);
      client.pin = data.pin;
      client.pin_confirm = data.pin_confirm;
      await client.save();
      return client;
    } catch (error) {
      throw error;
    }
  }

  // Get client by pin reset otp
  static async getClientByPinResetOtp(pin_reset_otp) {
    try {
      const client = await ClientModel.findOne({
        $and: [
          { pin_reset_otp },
          { pin_reset_otp_expires: { $gt: Date.now() } },
        ],
      });
      return client;
    } catch (error) {
      throw error;
    }
  }

  // Update is pin reset otp verified
  static async updatePinResetOtpVerified({ data, id }) {
    try {
      const client = await ClientModel.findByIdAndUpdate(
        id,
        {
          is_pin_reset_otp_verified: data.is_pin_reset_otp_verified,
        },
        { runValidators: true, new: true }
      );
      return client;
    } catch (error) {
      throw error;
    }
  }

  // Update profile picture
  static async updateProfilePicture({ data, id }) {
    try {
      const client = await ClientModel.findByIdAndUpdate(
        id,
        { profile_picture: data },
        { runValidators: true }
      );
      return client;
    } catch (error) {
      throw error;
    }
  }

  // Update account status
  static async updateClientAccountStatus({ account_status, id }) {
    try {
      const client = await ClientModel.findByIdAndUpdate(
        id,
        { account_status },
        { runValidators: true, new: true }
      );
      return client;
    } catch (error) {
      throw error;
    }
  }

  // Delete client account
  static async deleteClientAccount(id) {
    try {
      await ClientModel.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
}

// Export Client service
module.exports = Client;
