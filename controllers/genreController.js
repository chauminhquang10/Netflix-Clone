const Genre = require("../models/genreModel");
const Movies = require("../models/movieModel");

const APIFeatures = require("./classes/APIFeatures.js");

const genreController = {
  getGenres: async (req, res) => {
    try {
      const features = new APIFeatures(Genre.find(), req.query).filtering();

      const genres = await features.query;
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
      const movies = await Movies.findOne({ genre: req.params.id });
      if (movies)
        return res
          .status(400)
          .json({ msg: "Please delete all movies of this genre before!" });
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
