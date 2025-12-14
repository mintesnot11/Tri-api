// Admin Model
const AdminModel = require("./model");

// API Features
const APIFeatures = require("../../utils/apiFeatures");

// Admin service
class Admin {
  // Create an admin
  static async createAdmin(data) {
    try {
      const newAdmin = await AdminModel.create({
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        email: data.email,
        role: data.role,
        default_password: data.default_password,
        password: data.password,
        password_confirm: data.password_confirm,
        first_account: data.first_account,
      });
      return newAdmin;
    } catch (error) {
      throw error;
    }
  }

  // Get all admins
  static async getAllAdmins(query) {
    try {
      let admins;
      if (query) {
        const apiFeature = new APIFeatures(AdminModel.find(), query)
          .filter()
          .sort()
          .project()
          .paginate();
        admins = await apiFeature.query;
      } else {
        admins = await AdminModel.find();
      }

      return admins;
    } catch (error) {
      throw error;
    }
  }

  // Get a single admin
  static async getAdmin(id) {
    try {
      const admin = await AdminModel.findById(id);
      return admin;
    } catch (error) {
      throw error;
    }
  }

  // Admin login
  static async adminLogin(data) {
    try {
      const admin = await AdminModel.findOne({
        $or: [
          { email: data.email_or_phone },
          { phone_number: data.email_or_phone },
        ],
      });
      return admin;
    } catch (error) {
      throw error;
    }
  }

  // Update the default password
  static async updateDefaultPassword({ data, id }) {
    try {
      const admin = await AdminModel.findById(id);
      admin.default_password = undefined;
      admin.is_default_password = false;
      admin.count_default_password_update = 0;
      admin.password = data.password;
      admin.password_confirm = data.password_confirm;
      await admin.save();

      return admin;
    } catch (error) {
      throw error;
    }
  }

  // Update count default password update
  static async updateCountDefaultPassword({
    count_default_password_update,
    id,
  }) {
    try {
      await AdminModel.findByIdAndUpdate(
        id,
        { count_default_password_update: count_default_password_update + 1 },
        { runValidators: true }
      );
    } catch (error) {
      throw error;
    }
  }

  // Reset password
  static async resetAdminPassword({ data, id }) {
    try {
      const admin = await AdminModel.findById(id);
      admin.is_default_password = true;
      admin.count_default_password_update = 0;
      admin.default_password = data.default_password;
      admin.password = data.password;
      admin.password_confirm = data.password_confirm;
      await admin.save();
    } catch (error) {
      throw error;
    }
  }

  // Update an admin role
  static async updateAdminRole({ role, id }) {
    try {
      const admin = await AdminModel.findByIdAndUpdate(
        id,
        { role },
        { runValidators: true, new: true }
      );
      return admin;
    } catch (error) {
      throw error;
    }
  }

  // Update admin account status
  static async updateAdminStatus({ account_status, id }) {
    try {
      const admin = await AdminModel.findByIdAndUpdate(
        id,
        { account_status },
        { runValidators: true, new: true }
      );
      return admin;
    } catch (error) {
      throw error;
    }
  }

  // Update admin profile
  static async updateAdminProfile({ data, id }) {
    try {
      const admin = await AdminModel.findByIdAndUpdate(
        id,
        {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone_number: data.phone_number,
        },
        { runValidators: true, new: true }
      );
      return admin;
    } catch (error) {
      throw error;
    }
  }

  // Update password
  static async updateAdminPassword({ data, id }) {
    try {
      const admin = await AdminModel.findById(id);
      admin.password = data.password;
      admin.password_confirm = data.password_confirm;
      await admin.save();
    } catch (error) {
      throw error;
    }
  }

  // Delete an admin
  static async deleteAdmin(id) {
    try {
      await AdminModel.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete all admins except the first account
  static async deleteAllAdmins() {
    try {
      await AdminModel.deleteMany({ first_account: { $ne: true } });
    } catch (error) {
      throw error;
    }
  }
}

// Export Admin Service
module.exports = Admin;
