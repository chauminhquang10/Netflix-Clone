const Lists = require("../models/listModel");
const Movies = require("../models/movieModel");

const listController = {
  //lay random 10 lists
  getLists: async (req, res) => {
    try {
      const lists = await Lists.aggregate([{ $sample: { size: 5 } }]);
      res.json(lists);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  //only admin can create , update , delete list
  createList: async (req, res) => {
    try {
      const { title, genre } = req.body;
      const list = await Lists.findOne({ title: title.toLowerCase() });
      if (list)
        return res.status(400).json({ msg: "This list already exist!" });
      const movies = await Movies.aggregate([
        {
          $match: { genre },
        },
        { $sample: { size: 10 } },
      ]);
      const newList = new Lists({
        title: title.toLowerCase(),
        genre,
        items: movies,
      });
      await newList.save();
      res.json({ msg: "Created a new list" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteList: async (req, res) => {
    try {
      await Lists.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted a list!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateList: async (req, res) => {
    try {
      const { title, genre } = req.body;
      const movies = await Movies.aggregate([
        {
          $match: { genre },
        },
        { $sample: { size: 10 } },
      ]);
      await Lists.findOneAndUpdate(
        { _id: req.params.id },
        { title: title.toLowerCase(), genre, items: movies }
      );
      res.json({ msg: "Updated a list!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = listController;
