const Movies = require("../models/movieModel");

// filter, sorting and paginating
class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString };

    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );
    this.query.find(JSON.parse(queryStr));
    return this;
  }
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  paginating() {
    const page = this.queryString.page * 1 || 1; // page number
    const limit = this.queryString.limit * 1 || 9; // page size (số phần tử 1 trang)
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(99);
    return this;
  }
}

const movieController = {
  getMovies: async (req, res) => {
    try {
      const features = new APIfeatures(Movies.find(), req.query)
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
};

module.exports = movieController;
