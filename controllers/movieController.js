const Movies = require("../models/movieModel");
const Lists = require("../models/listModel");

const APIFeatures = require("./classes/APIFeatures.js");

const { ObjectId } = require("mongodb");

const movieController = {
  getMovies: async (req, res) => {
    try {
      const features = new APIFeatures(
        Movies.find().populate("allGenres", "name"),
        req.query
      )
        .moviesFiltering()
        .sorting();

      const movies = await features.query;

      let temp = [];

      if (req.query.genre) {
        for (let i = 0; i < movies.length; i++) {
          if (movies[i].allGenres.includes(ObjectId(req.query.genre)))
            temp.push(movies[i]);
        }
      }

      return res.status(200).json({
        status: "success",
        result: temp.length > 0 ? temp.length : movies.length,
        movies: temp.length > 0 ? temp : movies,
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
      const movie = await Movies.findById(req.params.id).populate(
        "allGenres",
        "name"
      );
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
        allGenres,
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
        allGenres,
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
      // xóa phim này ra khỏi list chứa nó trước khi xóa phim.
      const listContainMovie = await Lists.find({
        items: { $elemMatch: { _id: ObjectId(req.params.id) } },
      });

      // nếu có list chứa nó thì
      if (listContainMovie.length > 0) {
        const { items, genre } = listContainMovie[0];

        await Lists.findOneAndUpdate(
          { _id: listContainMovie[0]._id },
          {
            $pull: { items: { _id: ObjectId(req.params.id) } },
          },
          { new: true }
        );

        let allItemsId = items.map((item) => {
          return item._id;
        });

        const addNewMovie = await Movies.aggregate([
          {
            $match: {
              $and: [
                {
                  allGenres: {
                    $in: [ObjectId(genre)],
                  },
                  listId: null,
                },
                {
                  _id: {
                    $nin: allItemsId,
                  },
                },
              ],
            },
          },
          { $sample: { size: 1 } },
        ]);

        if (addNewMovie.length > 0) {
          await Lists.findOneAndUpdate(
            { _id: listContainMovie[0]._id },
            {
              $push: { items: addNewMovie[0] },
            },
            { new: true }
          );
        } else
          return res.status(400).json({
            msg: "Can't delete this movie because of not having enough movie to fit in the list",
          });
      }

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
        allGenres,
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
          allGenres,
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
        return res.status(400).json({ msg: "You liked this movie." });

      const like = await Movies.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.user.id },
        },
        { new: true }
      );

      if (!like)
        return res.status(400).json({ msg: "This movie does not exist." });

      const { likes, dislikes } = like;

      if (likes.length > 0 || dislikes.length > 0) {
        const movieScore = scoreCalculating(like);

        console.log(movieScore);

        // có được score rồi thì update score của phim
        await Movies.findOneAndUpdate(
          { _id: req.params.id },
          {
            score: parseFloat(movieScore),
          }
        );
      }

      res.json({ msg: "Liked movie!" });
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
        return res.status(400).json({ msg: "This movie does not exist." });

      const { likes, dislikes } = like;

      if (likes.length > 0 || dislikes.length > 0) {
        const movieScore = scoreCalculating(like);

        console.log(movieScore);

        // có được score rồi thì update score của phim
        await Movies.findOneAndUpdate(
          { _id: req.params.id },
          {
            score: parseFloat(movieScore),
          }
        );
      }

      res.json({ msg: "UnLiked movie!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  dislikeMovie: async (req, res) => {
    try {
      const movie = await Movies.find({
        _id: req.params.id,
        dislikes: req.user.id,
      });

      if (movie.length > 0)
        return res.status(400).json({ msg: "You disliked this movie." });

      const dislike = await Movies.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { dislikes: req.user.id },
        },
        { new: true }
      );

      if (!dislike)
        return res.status(400).json({ msg: "This movie does not exist." });

      const { likes, dislikes } = dislike;

      if (likes.length > 0 || dislikes.length > 0) {
        const movieScore = scoreCalculating(dislike);

        console.log(movieScore);

        // có được score rồi thì update score của phim
        await Movies.findOneAndUpdate(
          { _id: req.params.id },
          {
            score: parseFloat(movieScore),
          }
        );
      }

      res.json({ msg: "Disliked movie!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unDislikeMovie: async (req, res) => {
    try {
      const dislike = await Movies.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { dislikes: req.user.id },
        },
        { new: true }
      );

      if (!dislike)
        return res.status(400).json({ msg: "This movie does not exist." });

      const { likes, dislikes } = dislike;

      if (likes.length > 0 || dislikes.length > 0) {
        const movieScore = scoreCalculating(dislike);

        console.log(movieScore);

        // có được score rồi thì update score của phim
        await Movies.findOneAndUpdate(
          { _id: req.params.id },
          {
            score: parseFloat(movieScore),
          }
        );
      }

      res.json({ msg: "UnDisliked movie!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getTopMoviesStats: async (req, res) => {
    try {
      // Thống kê những top movies (tổng lượt views cao nhất) của bên admin.
      const topMovies = await Movies.find().sort({ views: -1 }).limit(5);
      res.status(200).json(topMovies);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getRankingMovies: async (req, res) => {
    try {
      // Thống kê những top movies với điểm (score) cao nhất để làm bxh bên user.
      const topScoreMovies = await Movies.find().sort({ score: -1 }).limit(5);
      res.status(200).json({ topScoreMovies });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

// hàm tính logarit cơ số 10
const log10 = (val) => {
  return Math.log(val) / Math.log(10);
};

// Hàm tính điểm (score) cho movie.
const scoreCalculating = (movieData) => {
  let n;
  let sign;

  const { likes, dislikes, createdAt } = movieData;

  // lấy ngày tạo phim dạng unix timestamp
  const movieCreatedDate = Math.floor(new Date(createdAt).getTime() / 1000);

  const seconds = movieCreatedDate - 1640995200;

  const votes = likes.length - dislikes.length;

  if (votes > 0) sign = 1;
  else if (votes < 0) sign = -1;
  else sign = 0;

  const s = Math.abs(votes);
  if (s >= 1) n = s;
  else n = 1;

  // 45000 = 12.5 h (a half day)
  const scoreValue = log10(n) + (sign * seconds) / 45000;

  return scoreValue;
};

module.exports = movieController;
