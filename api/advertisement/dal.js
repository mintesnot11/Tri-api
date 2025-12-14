// Ad Model
const AdModel = require("./model");

// API Features
const APIFeatures = require("../../utils/apiFeatures");

class Ad {
  // Create an ad
  static async createAd(data) {
    try {
      const newAd = await AdModel.create({
        company_name: data.company_name,
        expire_date: data.expire_date,
        image: data.image,
        spot_label: data.spot_label,
      });
      return newAd;
    } catch (error) {
      throw error;
    }
  }

  // Get ads using label
  static async getAdByLabel(spot_label) {
    try {
      const ads = await AdModel.find({ spot_label });
      return ads;
    } catch (error) {
      throw error;
    }
  }

  // Get ads
  static async getAllAds(query) {
    try {
      const apiFeatures = new APIFeatures(AdModel.find(), query)
        .filter()
        .sort()
        .project()
        .paginate();
      const ads = await apiFeatures.query;
      return ads;
    } catch (error) {
      throw error;
    }
  }

  // Get an ad
  static async getAd(id) {
    try {
      const ad = await AdModel.findById(id);
      return ad;
    } catch (error) {
      throw error;
    }
  }

  // Update an ad info
  static async updateAdInfo({ data, id }) {
    try {
      const ad = await AdModel.findByIdAndUpdate(
        id,
        {
          company_name: data.company_name,
          expire_date: data.expire_date,
          spot_label: data.spot_label,
        },
        { runValidators: true, new: true }
      );
      return ad;
    } catch (error) {
      throw error;
    }
  }

  // Update an ad image
  static async updateAdImage({ data, id }) {
    try {
      const ad = await AdModel.findByIdAndUpdate(
        id,
        { image: data },
        { runValidators: true, new: true }
      );
      return ad;
    } catch (error) {
      throw error;
    }
  }

  // Delete an ad image
  static async deleteAd(id) {
    try {
      await AdModel.findByIdAndDelete(id);
    } catch (error) {
      next(error);
    }
  }

  // Delete all ads
  static async deleteAllAds() {
    try {
      await AdModel.deleteMany({});
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Ad;
