const router = require("express").Router();
const discountController = require("../controllers/discountController");
const auth = require("../middlewares/Auth");
const authAdmin = require("../middlewares/AuthAdmin");

router.get("/discounts", discountController.getDiscounts);

router.post("/discount", auth, authAdmin, discountController.createDiscount);

router.delete(
  "/discount/:id",
  auth,
  authAdmin,
  discountController.deleteDiscount
);

router.put("/discount/:id", auth, authAdmin, discountController.updateDiscount);

module.exports = router;
