const Genre = require("../models/genreModel");

const genreController = {
  getGenres: async (req, res) => {
    try {
      const genres = await Genre.find();
      res.json(genres);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  //only admin can create , update , delete genre
  createGenre: async (req, res) => {
    try {
      const { name } = req.body;
      const genre = await Genre.findOne({ name: name.toLowerCase() });
      if (genre)
        return res.status(400).json({ msg: "This genre already exist!" });

      const newGenre = new Genre({ name: name.toLowerCase() });
      await newGenre.save();
      res.json({ msg: "Created a new genre" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteGenre: async (req, res) => {
    try {
      await Genre.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted a genre!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateGenre: async (req, res) => {
    try {
      const { name } = req.body;
      await Genre.findOneAndUpdate(
        { _id: req.params.id },
        { name: name.toLowerCase() }
      );
      res.json({ msg: "Updated a genre!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = genreController;
