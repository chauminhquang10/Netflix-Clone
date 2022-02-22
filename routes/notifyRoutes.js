const router = require("express").Router();
const notifyController = require("../controllers/notifyController");
const auth = require("../middlewares/Auth");

router.route("/notify").post(auth, notifyController.createNotify);

// xóa luôn cái thông báo khi admin xóa phim

// xóa 1 thông báo của user
router
  .route("/notify/:id")
  .delete(auth, notifyController.removeNotify)
  .patch(auth, notifyController.deleteOneNotify);

// lấy tất cả thông báo
router.route("/notifies").get(auth, notifyController.getNotifies);

// lấy tất cả thông báo MỚI
router.route("/newNotifies").get(auth, notifyController.getNewNotifies);

// đánh dấu đã đọc
router.route("/readNotify/:id").patch(auth, notifyController.isReadNotify);

// xóa người dùng ra khỏi danh sách nhận thông báo (đối với tất cả thông báo)
router
  .route("/deleteAllNotifies")
  .patch(auth, notifyController.deleteAllNotifies);

// xóa tất cả thông báo mới của người dùng
router
  .route("/deleteAllNewNotifies")
  .patch(auth, notifyController.deleteAllNewNotifies);

module.exports = router;
