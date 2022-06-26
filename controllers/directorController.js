const Directors = require("../models/directorModel");

const Movies = require("../models/movieModel");

const fs = require(`fs`);

const directorController = {
  getDirectors: async (req, res) => {
    try {
      const directors = await Directors.find();
      res.json(directors);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  //only admin can create , update , delete director
  createDirector: async (req, res) => {
    try {
      const {
        name,
        image,
        gender,
        place_of_birth,
        birthday,
        biography,
        tmdbID,
      } = req.body;
      const director = await Directors.findOne({ name: name.toLowerCase() });
      if (director)
        return res.status(400).json({ msg: "This director already exist!" });

      const newDirector = new Directors({
        name: name.toLowerCase(),
        image,
        gender,
        place_of_birth,
        birthday,
        biography,
        tmdbID,
      });
      await newDirector.save();
      res.json({ msg: "Created a new actor" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  loadDirector: async (req, res) => {
    try {
      let rawdata = fs.readFileSync("./NewDirector.json");

      let director = JSON.parse(rawdata);

      await Directors.insertMany(director);

      res.json({ msg: "Created a new director" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  deleteDirector: async (req, res) => {
    try {
      // xóa những phim có đạo diễn này tham gia trước.
      const deleteDirectorMovies = await Movies.find({
        directorsBelongTo: req.params.id,
      });

      deleteDirectorMovies.filter((movie) => {
        return deleteDirectorFromMovie(movie._id, req.params.id);
      });

      await Directors.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted a director!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  updateDirectors: async (req, res) => {
    try {
      let rawdata = fs.readFileSync("./DirectorTest.json");

      let directors = JSON.parse(rawdata);

      directors.forEach(async (director) => {
        const a = await Directors.updateOne(
          { tmdbID: director["tmdbID"] },
          { knownFor: director["knownFor"] }
        );
      });

      res.json({ msg: "Directors Updated" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  deleteDirectors: async (req, res) => {
    try {
      const a = await Directors.deleteMany({ knownFor: [] });
      res.json({ msg: "Directors Deleted" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  updateDirector: async (req, res) => {
    try {
      const {
        name,
        image,
        gender,
        place_of_birth,
        birthday,
        biography,
        tmdbID,
      } = req.body;
      await Directors.findOneAndUpdate(
        { _id: req.params.id },
        {
          name: name.toLowerCase(),
          image,
          gender,
          place_of_birth,
          birthday,
          biography,
          tmdbID,
        }
      );
      res.json({ msg: "Updated a director!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

const deleteDirectorFromMovie = async (movieId, directorId) => {
  await Movies.findOneAndUpdate(
    { _id: movieId },
    {
      $pull: { directorsBelongTo: directorId },
    },
    { new: true }
  );
};

module.exports = directorController;
