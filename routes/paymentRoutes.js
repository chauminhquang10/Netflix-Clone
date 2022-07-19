const router = require("express").Router();
const paymentController = require("../controllers/paymentController");
const auth = require("../middlewares/Auth");
const authAdmin = require("../middlewares/AuthAdmin");

router
  .route("/payment")
  .get(auth, authAdmin, paymentController.getPayments)
  .post(auth, paymentController.createPayment);

router
  .route("/newPayments")
  .get(auth, authAdmin, paymentController.getNewPayments);

// get doanh thu của 1 tháng trong năm
router.get(
  "/monthRevenue",
  auth,
  authAdmin,
  paymentController.getCurrentMonthRevenue
);

// thống kê doanh thu theo từng tháng trong năm
router.get("/monthStats", auth, authAdmin, paymentController.getMonthStats);

// tổng doanh thu trong ngày hiện tại
router.get("/todayStats", auth, authAdmin, paymentController.getTodayStats);

// Thống kê số lượng mã giảm giá được khách hàng dùng theo từng tháng.
router.get(
  "/discountStats",
  auth,
  authAdmin,
  paymentController.getDiscountsStats
);

// Thống kê số tiền giảm giá của khách hàng dùng theo từng tháng.
router.get(
  "/discountPriceStats",
  auth,
  authAdmin,
  paymentController.getDiscountsPriceStats
);

// Thống kê số lượng từng loại mã giảm giá nào được dùng theo từng tháng.
router.get(
  "/discountQuantityStats",
  auth,
  authAdmin,
  paymentController.getDiscountsQuantityStats
);

// Thống kê những top users (tổng lượt payment với tổng số tiền đã tiêu).
router.get(
  "/topUsersStats",
  auth,
  authAdmin,
  paymentController.getTopUsersStats
);

module.exports = router;
