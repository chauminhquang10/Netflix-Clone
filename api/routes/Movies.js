const router = require("express").Router();
const Movie = require("../models/Movie");

const verify = require("../middlewares/verifyToken");

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
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 3;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

//get all movies (có r)
// admin này là cần , comment để test tạm thời
router.get("/", verify, async (req, res) => {
  // if (req.user.isAdmin) {
  try {
    const features = new APIfeatures(Movie.find(), req.query)
      .filtering()
      .sorting()
      .paginating();
    const movies = await features.query;
    res.status(200).json({
      status: "success",
      result: movies.length,
      movies: movies,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
  // } else {
  //   return res.status(403).json({ msg: "You're not allowed!" });
  // }
});

//create new movie (có r)

router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const {
        title,
        desc,
        img,
        imgTitle,
        imgSmall,
        trailer,
        video,
        year,
        limitAge,
        genre,
      } = req.body;

      const movie = await Movie.findOne({ title });
      if (movie)
        return res.status(400).json({ msg: "This movie already exist!" });

      const newMovie = new Movie({
        title: title.toLowercase(),
        desc,
        img,
        imgTitle,
        imgSmall,
        trailer,
        video,
        year,
        limitAge,
        genre,
      });
      await newMovie.save();
      return res.status(201).json({ msg: "Created a new movie!" });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json({ msg: "You're not allowed!" });
  }
});

//update movie (có r)

router.put("/:movieId", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const {
        title,
        desc,
        img,
        imgTitle,
        imgSmall,
        trailer,
        video,
        year,
        limitAge,
        genre,
      } = req.body;

      await Movie.findOneAndUpdate(
        { _id: req.params.movieId },
        {
          title: title.toLowercase(),
          desc,
          img,
          imgTitle,
          imgSmall,
          trailer,
          video,
          year,
          limitAge,
          genre,
        }
      );
      return res.status(200).json({ msg: "Updated a movie!" });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json({ msg: "You're not allowed!" });
  }
});

//delete movie(có r)

router.delete("/:movieId", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await Movie.findByIdAndDelete(req.params.movieId);
      return res.status(200).json({ msg: "The movie has been deleted!" });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json({ msg: "You're not allowed!" });
  }
});

//get a movie (có r)
router.get("/find/:movieId", verify, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    return res.status(200).json(movie);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//get random movie (ch có)
router.get("/random", verify, async (req, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type === "series") {
      movie = await Movie.aggregate([
        {
          $match: { isSeries: true },
        },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        {
          $match: { isSeries: false },
        },
        { $sample: { size: 1 } },
      ]);
    }
    return res.status(200).json(movie[0]);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
