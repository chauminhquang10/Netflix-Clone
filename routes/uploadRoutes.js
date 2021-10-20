const router = require("express").Router();

const UploadImage = require("../middlewares/UploadImage");

const uploadController = require("../controllers/uploadController");

const auth = require("../middlewares/Auth");

router.post("/upload_avatar", UploadImage, auth, uploadController.uploadAvatar);

router.post("/delete_avatar", auth, uploadController.deleteAvatar);

module.exports = router;
