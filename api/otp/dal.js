// Otp model
const OtpModel = require("./model");

// Otp Service
class Otp {
  // Create otp
  static async createOtp(data) {
    try {
      const newOtp = await OtpModel.create({
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        address: data.address,
        otp: data.otp,
      });
      return newOtp;
    } catch (error) {
      throw error;
    }
  }

  // Get all otps
  static async getAllOtpsByPhoneNumber(phone_number) {
    try {
      const otps = await OtpModel.find({ phone_number });
      return otps;
    } catch (error) {
      throw error;
    }
  }

  // Get otp using phone number
  static async getOtpByPhoneNumber(phone_number) {
    try {
      const otp = await OtpModel.findOne({ phone_number });
      return otp;
    } catch (error) {
      throw error;
    }
  }

  // Delete Otps
  static async deleteOtpsByPhoneNumber(phone_number) {
    try {
      await OtpModel.deleteMany({ phone_number });
    } catch (error) {
      throw error;
    }
  }

  // Delete not verified otps
  static async deleteNotVerifiedOtps(phone_number) {
    try {
      await OtpModel.deleteMany({
        $and: [{ phone_number, otp_status: "Not-verified" }],
      });
    } catch (error) {
      throw error;
    }
  }
}

// Export Otp
module.exports = Otp;
