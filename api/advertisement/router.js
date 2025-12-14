// Express
const express = require("express");

// Router
const router = express.Router();

// Controllers
const {
  createAd,
  getAllAds,
  getAd,
  updateAd,
  updateAdImage,
  deleteAd,
  deleteAllAds,
} = require("./controller");

// Protect
const protect = require("../../protect");

// Auth
const auth = require("../../auth");

// Validator
const validator = require("../../utils/validator");

// Validation Schema
const {
  createAdSchema,
  updateAdSchema,
  updateAdImageSchema,
} = require("./validation_schema");

router
  .route("/")
  .post(
    protect,
    auth("Owner", "Super-admin"),
    validator(createAdSchema),
    createAd.getBody,
    createAd.checkExpireDate,
    createAd.checkAd,
    createAd.createAd
  )
  .get(
    protect,
    auth("Owner", "Super-admin", "Admin", "Client"),
    getAllAds.getAds,
    getAllAds.checkExpireDateAndRespond
  )
  .delete(protect, auth("Owner", "Super-admin"), deleteAllAds);

router
  .route("/:id")
  .get(protect, auth("Owner", "Super-admin", "Admin"), getAd)
  .patch(
    protect,
    auth("Owner", "Super-admin"),
    validator(updateAdSchema),
    updateAd.checkAd,
    updateAd.getBody,
    updateAd.checkExpireDate,
    updateAd.checkAdSpot,
    updateAd.updateAd
  )
  .delete(
    protect,
    auth("Owner", "Super-admin"),
    deleteAd.checkAd,
    deleteAd.deleteAd
  );

router.patch(
  "/:id/adimage",
  protect,
  auth("Owner", "Super-admin"),
  validator(updateAdImageSchema),
  updateAdImage.checkAd,
  updateAdImage.getBody,
  updateAdImage.updateAd
);

module.exports = router;
