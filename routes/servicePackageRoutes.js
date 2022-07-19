const router = require("express").Router();
const packageController = require("../controllers/packageController");
const auth = require("../middlewares/Auth");
const authAdmin = require("../middlewares/AuthAdmin");

router
  .route("/packages")
  .get(packageController.getPackages)
  .post(auth, authAdmin, packageController.createPackage);

router
  .route("/packages/:id")
  .delete(auth, authAdmin, packageController.deletePackage)
  .put(auth, authAdmin, packageController.updatePackage);

//  Thống kê tên gói với số lượt mua tương ứng, tỉ lệ là bao nhiêu?
router.get(
  "/packageStats",
  auth,
  authAdmin,
  packageController.getPackagesStats
);

module.exports = router;
