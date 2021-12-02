const router = require("express").Router();
const cloudinary = require("cloudinary");
const fs = require("fs");

const auth = require("../middlewares/Auth");
const AuthAdmin = require("../middlewares/AuthAdmin");
const UploadImage = require("../middlewares/UploadImage");

// dùng để upload liên quan đến phim
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//upload only admin can
router.post("/upload", UploadImage, auth, AuthAdmin, (req, res) => {
  try {
    const file = req.files.file;

    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      {
        folder: "movie",
      },
      async (err, result) => {
        if (err) throw err;
        removeTmp(file.tempFilePath);

        res.json({ public_id: result.public_id, url: result.secure_url });
      }
    );
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

//upload only admin can
router.post("/uploadSmall", UploadImage, auth, AuthAdmin, (req, res) => {
  try {
    const file = req.files.file;

    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      {
        folder: "movieSmall",
      },
      async (err, result) => {
        if (err) throw err;
        removeTmp(file.tempFilePath);

        res.json({ public_id: result.public_id, url: result.secure_url });
      }
    );
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

//delete only admin can
router.post("/delete", auth, AuthAdmin, (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ msg: "No image selected!" });

    cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
      if (err) throw err;
      res.json({ msg: "Image Deleted!" });
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

module.exports = router;
