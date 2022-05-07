const Movies = require("../models/movieModel");

const APIFeatures = require("./classes/APIFeatures.js");

const movieController = {
  getMovies: async (req, res) => {
    try {
      const features = new APIFeatures(Movies.find(), req.query)
        .filtering()
        .sorting();

      const movies = await features.query;
      res.status(200).json({
        status: "success",
        result: movies.length,
        movies: movies,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  // getAllMovies: async (req, res) => {
  //   try {
  //     const movies = await Movies.find();
  //     res.status(200).json(movies);
  //   } catch (error) {
  //     return res.status(500).json({ msg: error.message });
  //   }
  // },

  //get a movie
  getOneMovie: async (req, res) => {
    try {
      const movie = await Movies.findById(req.params.id);
      return res.status(200).json({ movie });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createMovie: async (req, res) => {
    try {
      const {
        title,
        desc,
        img,
        imgSmall,
        imgTitle,
        trailer,
        video,
        year,
        limitAge,
        duration,
        genre,
        TMDBid,
      } = req.body;
      // if (!img ||   !trailer || !video)
      //nữa thêm cái comment này vào lại
      if (!img)
        return res.status(400).json({ msg: "No images or video uploaded!" });
      const movie = await Movies.findOne({ title: title.toLowerCase() });
      if (!imgSmall)
        return res.status(400).json({ msg: "No imgSmall uploaded!" });
      if (movie)
        return res.status(400).json({ msg: "This movie already exist!" });
      const newMovie = new Movies({
        title: title.toLowerCase(),
        desc,
        img,
        imgSmall,
        trailer,
        video,
        year,
        limitAge,
        duration,
        genre,
        TMDBid,
      });
      await newMovie.save();
      res.json({
        msg: "Created a new movie!",
        newMovie: {
          ...newMovie._doc,
          user: req.user,
        },
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteMovie: async (req, res) => {
    try {
      await Movies.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted a movie!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateMovie: async (req, res) => {
    try {
      const {
        title,
        desc,
        img,
        imgSmall,
        trailer,
        video,
        year,
        limitAge,
        duration,
        genre,
        TMDBid,
      } = req.body;
      // if (!img  || !trailer || !video)
      //nữa thêm cái comment này vào lại
      if (!img)
        return res.status(400).json({ msg: "No images or video uploaded!" });
      await Movies.findOneAndUpdate(
        { _id: req.params.id },
        {
          title: title.toLowerCase(),
          desc,
          img,
          imgSmall,
          trailer,
          video,
          year,
          limitAge,
          duration,
          genre,
          TMDBid,
        }
      );
      res.json({ msg: "Updated a movie!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  likeMovie: async (req, res) => {
    try {
      const movie = await Movies.find({
        _id: req.params.id,
        likes: req.user.id,
      });

      if (movie.length > 0)
        return res.status(400).json({ msg: "You liked this post." });

      const like = await Movies.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.user.id },
        },
        { new: true }
      );

      if (!like)
        return res.status(400).json({ msg: "This post does not exist." });

      res.json({ msg: "Liked Post!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unLikeMovie: async (req, res) => {
    try {
      const like = await Movies.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { likes: req.user.id },
        },
        { new: true }
      );

      if (!like)
        return res.status(400).json({ msg: "This post does not exist." });

      res.json({ msg: "UnLiked Post!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = movieController;
