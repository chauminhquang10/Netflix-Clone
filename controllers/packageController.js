const Packages = require("../models/packModel");
const Movies = require("../models/movieModel");

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
      await Packages.findByIdAndDelete(req.params.id);
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
};

module.exports = packageController;
