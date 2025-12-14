// Ad
const Ad = require("./dal");

// App Error
const AppError = require("../../utils/appError");

// Configs
const configs = require("../../configs");

// Create an ad
exports.createAd = {
  getBody: async (req, res, next) => {
    try {
      // Get data
      const data = req.value;

      req.data = data;

      next();
    } catch (error) {
      next(error);
    }
  },
  checkExpireDate: async (req, res, next) => {
    try {
      const expire_date = req.data.expire_date;

      if (new Date(expire_date).getTime() <= new Date(Date.now()).getTime())
        return next(
          new AppError("Expire date can not be less than the current date", 400)
        );

      next();
    } catch (error) {
      next(error);
    }
  },
  checkAd: async (req, res, next) => {
    try {
      const ads = await Ad.getAdByLabel(req.data.spot_label);
      if (ads.length >= configs.ad.max_size)
        return next(
          new AppError(
            "There is no available spot with the specified label",
            400
          )
        );
      next();
    } catch (error) {
      next(error);
    }
  },
  createAd: async (req, res, next) => {
    try {
      const newAd = await Ad.createAd(req.value);

      // Respond
      res.status(200).json({
        status: "SUCCESS",
        message: "New advertisement is successfully created",
        data: {
          ad: newAd,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

// Get all ads
exports.getAllAds = {
  getAds: async (req, res, next) => {
    try {
      const ads = await Ad.getAllAds(req.query);
      req.ads = ads;
      next();
    } catch (error) {
      next(error);
    }
  },
  checkExpireDateAndRespond: async (req, res, next) => {
    try {
      const ads = req.ads;

      ads.forEach(async (ad) => {
        if (new Date(ad.expire_date).getTime() < new Date(Date.now())) {
          ad.is_expired = true;
          await ad.save();
        }
      });

      // Respond
      res.status(200).json({
        status: "SUCCESS",
        results: ads.length,
        data: {
          ads,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

// Get an ad
exports.getAd = async (req, res, next) => {
  try {
    const ad = await Ad.getAd(req.params.id);
    if (!ad)
      return next(
        new AppError("There is no advertisement with the specified ID", 400)
      );

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      data: {
        ad,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update ad info
exports.updateAd = {
  checkAd: async (req, res, next) => {
    try {
      const ad = await Ad.getAd(req.params.id);
      if (!ad)
        return next(
          new AppError("There is no Advertisement with the specified ID", 400)
        );
      next();
    } catch (error) {
      next(error);
    }
  },
  getBody: async (req, res, next) => {
    try {
      // Get data
      const data = req.value;

      req.data = data;

      next();
    } catch (error) {
      next(error);
    }
  },
  checkExpireDate: async (req, res, next) => {
    try {
      const expire_date = req.data.expire_date;

      if (new Date(expire_date).getTime() <= new Date(Date.now()).getTime())
        return next(
          new AppError("Expire date can not be less than the current date", 400)
        );

      next();
    } catch (error) {
      next(error);
    }
  },
  checkAdSpot: async (req, res, next) => {
    try {
      const ads = await Ad.getAdByLabel(req.data.spot_label);
      if (ads.length >= configs.ad.max_size)
        return next(
          new AppError(
            "There is no available spot with the specified label",
            400
          )
        );

      next();
    } catch (error) {
      next(error);
    }
  },
  updateAd: async (req, res, next) => {
    try {
      const ad = await Ad.updateAdInfo({ data: req.data, id: req.params.id });

      // Respond
      res.status(200).json({
        status: "SUCCESS",
        message: "The advertisement is successfully updated",
        data: {
          ad,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

// Update ad image
exports.updateAdImage = {
  checkAd: async (req, res, next) => {
    try {
      const ad = await Ad.getAd(req.params.id);
      if (!ad)
        return next(
          new AppError("There is no Advertisement with the specified ID", 400)
        );
      next();
    } catch (error) {
      next(error);
    }
  },
  getBody: async (req, res, next) => {
    try {
      // Get data
      const image = req.value.image;

      req.image = image;

      next();
    } catch (error) {
      next(error);
    }
  },
  updateAd: async (req, res, next) => {
    try {
      const ad = await Ad.updateAdImage({ data: req.image, id: req.params.id });

      // Respond
      res.status(200).json({
        status: "SUCCESS",
        message: "The advertisement image is updated",
        data: {
          ad,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

// Delete an ad
exports.deleteAd = {
  checkAd: async (req, res, next) => {
    try {
      const ad = await Ad.getAd(req.params.id);
      if (!ad)
        return next(
          new AppError("There is no Advertisement with the specified ID", 400)
        );
      next();
    } catch (error) {
      next(error);
    }
  },

  deleteAd: async (req, res, next) => {
    try {
      const delete_key = req.body.delete_key;
      if (!delete_key)
        return next(new AppError("Please provide the delete key", 400));

      if (delete_key === configs.delete_key) {
        return next(new AppError("Invalid delete key", 400));
      }

      await Ad.deleteAd(req.params.id);

      // Respond
      res.status(200).json({
        status: "SUCCESS",
        message: "The advertisement is successfully deleted",
      });
    } catch (error) {
      next(error);
    }
  },
};

// Delete all ads
exports.deleteAllAds = async (req, res, next) => {
  try {
    const delete_key = req.body.delete_key;
    if (!delete_key)
      return next(new AppError("Please provide the delete key", 400));

    if (delete_key === configs.delete_key) {
      return next(new AppError("Invalid delete key", 400));
    }

    await Ad.deleteAllAds();

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: "All advertisements are successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};
