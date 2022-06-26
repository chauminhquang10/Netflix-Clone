const Genre = require("../models/genreModel");
const Movies = require("../models/movieModel");

const APIFeatures = require("./classes/APIFeatures.js");
const fs = require(`fs`);

const genreController = {
  getGenres: async (req, res) => {
    try {
      const features = new APIFeatures(
        Genre.find(),
        req.query
      ).genresFiltering();

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
      const createdGenre = await newGenre.save();
      return res.json({ createdGenre });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  loadgenres: async (req, res) => {
    try {
      let rawdata = fs.readFileSync("./Genres.json");

      let genres = JSON.parse(rawdata);

      await Genre.insertMany(genres);

      res.json({ msg: "Loaded a new genres" });
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

      res.json({ msg: "Updated a genre" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getTopGenresStats: async (req, res) => {
    try {
      // Thống kê những top genres (tổng lượt views cao nhất).
      const topGenres = await Genre.find().sort({ views: -1 }).limit(5);
      res.status(200).json(topGenres);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = genreController;
