const Packages = require("../models/packModel");
const Movies = require("../models/movieModel");
const Users = require("../models/userModel");

const { ObjectId } = require("mongodb");

const packageController = {
  getPackages: async (req, res) => {
    try {
      const packages = await Packages.find();
      res.json(packages);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  // only admin can create , update , delete package
  createPackage: async (req, res) => {
    try {
      const { title, price, video_quality, resolution, image, devices } =
        req.body;
      // if(!image) return res.status(400).json({msg: "No image upload"})

      const pack = await Packages.findOne({ title: title.toLowerCase() });
      if (pack)
        return res.status(400).json({ msg: "This package already exist!" });

      const newPack = new Packages({
        title: title.toLowerCase(),
        price,
        video_quality,
        resolution,
        image,
        devices,
      });
      await newPack.save();
      res.json({ msg: "Created a new package" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deletePackage: async (req, res) => {
    try {
      const users = await Users.find({ role: 0 });

      await Packages.findByIdAndDelete(req.params.id);

      users.filter((user) => {
        return deleteUserPack(req.params.id, user);
      });

      res.json({ msg: "Deleted a package!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updatePackage: async (req, res) => {
    try {
      const { title, price, video_quality, resolution, image, devices } =
        req.body;

      // if(!image) return res.status(400).json({msg: "No image upload"})

      await Packages.findOneAndUpdate(
        { _id: req.params.id },
        {
          title: title.toLowerCase(),
          price,
          video_quality,
          resolution,
          image,
          devices,
        }
      );
      res.json({ msg: "Updated a package!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getPackagesStats: async (req, res) => {
    try {
      const allPackages = await Packages.find().select("title sold");

      const totalSold = allPackages.reduce((prev, package) => {
        return prev + package.sold;
      }, 0);

      res.status(200).json({
        allPackages,
        totalSold,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

// KHI ADMIN XÓA 1 GÓI THÌ XÓA CÁI USER_PACK (TRẠNG THÁI LƯU GÓI ĐÓ) Ở TẤT CẢ NGƯỜI DÙNG NÀO CÓ LƯU NÓ.
const deleteUserPack = async (packId, user) => {
  if (
    user.service_pack &&
    ObjectId(user.service_pack.packId).toString() === packId
  ) {
    await Users.findOneAndUpdate(
      { _id: user._id },
      {
        service_pack: {},
      }
    );
  }
};

module.exports = packageController;
