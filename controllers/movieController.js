const Movies = require("../models/movieModel");
const Lists = require("../models/listModel");
const Actors = require("../models/actorModel");
const Directors = require("../models/directorModel");

const APIFeatures = require("./classes/APIFeatures.js");

const { ObjectId } = require("mongodb");
const fetch = require("node-fetch");

const fs = require(`fs`);
const movieController = {
  getMovies: async (req, res) => {
    try {
      const features = new APIFeatures(Movies.find(), req.query)
        .moviesFiltering()
        .sorting();

      const movies = await features.query;

      return res.status(200).json({
        status: "success",
        result: movies.length,
        movies: movies,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: error.message });
    }
  },

  //get a movie
  getOneMovie: async (req, res) => {
    try {
      const movie = await Movies.findById(req.params.id)
        .populate("allGenres", "name")
        .populate("actorsBelongTo")
        .populate("directorsBelongTo");
      return res.status(200).json({ movie });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  fetchGenres: async (req, res) => {
    try {
      const { desc } = req.body;
      if (desc) {
        Genres = await fetch("https://rivero-d2v-api.herokuapp.com/predict", {
          method: "POST",
          body: JSON.stringify({
            overview: desc,
          }),
          headers: { "Content-Type": "application/json" },
          crossDomain: true,
        })
          .then((data) => data.json())
          .then((data) => {
            if (data.genres)
              try {
                return data.genres?.replace(/[^A-Za-z,]/g, "").split(",");
              } catch (error) {
                console.log(error);
              }
          });
        res.json({
          msg: Genres,
        });
      }
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
        trailer,
        year,
        limitAge,
        duration,
        original_country,
        allGenres,
        TMDBid,
        actorsBelongTo,
        directorsBelongTo,
        imdbId,
        imdb_rating,
        original_language,
      } = req.body;
      if (!img || !imgSmall)
        return res
          .status(400)
          .json({ msg: "Backdrop and poster image cannot be empty" });
      if (!trailer)
        return res.status(400).json({ msg: "Trailer link cannot be empty" });
      const movie = await Movies.findOne({ title: title.toLowerCase() });
      if (movie)
        return res.status(400).json({ msg: "This movie already exist!" });
      const newMovie = new Movies({
        title: title.toLowerCase(),
        desc,
        img,
        imgSmall,
        trailer,
        year,
        limitAge,
        duration,
        allGenres,
        TMDBid,
        actorsBelongTo,
        original_country,
        directorsBelongTo,
        imdbId,
        imdb_rating,
        original_language,
      });
      const createdMovie = await newMovie.save();

      // lưu id phim này vào mảng knownFor cho các diễn viên, đạo diễn.
      actorsBelongTo.filter((actorId) => {
        return addKnownForActor(actorId, createdMovie._id);
      });

      directorsBelongTo.filter((directorId) => {
        return addKnownForDirector(directorId, createdMovie._id);
      });

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
  loadmovies: async (req, res) => {
    try {
      let rawdata = fs.readFileSync("./Movies.json");

      let movies = JSON.parse(rawdata);

      Movies.insertMany(movies);

      res.json({
        msg: "Created a new movie!",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  deleteMovies: async (req, res) => {
    try {
      let rawdata = fs.readFileSync("./dupList.json");

      let movies = JSON.parse(rawdata);

      for (let i = 0; i < movies.length; i++) {
        console.log(`deleting ${movies[i]}`);
        // xóa phim này ra khỏi list chứa nó trước khi xóa phim.
        const listContainMovie = await Lists.find({
          items: { $elemMatch: { _id: ObjectId(movies[i]) } },
        });

        // nếu có list chứa nó thì
        if (listContainMovie.length > 0) {
          const { items, genre } = listContainMovie[0];

          await Lists.findOneAndUpdate(
            { _id: listContainMovie[0]._id },
            {
              $pull: { items: { _id: ObjectId(movies[i]) } },
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

        // Xóa id phim này ra khỏi mảng knownFor của các diễn viên, đạo diễn trước khi xóa phim.
        const actorsContainMovie = await Actors.find({
          knownFor: movies[i],
        });

        if (actorsContainMovie.length > 0) {
          actorsContainMovie.filter((actor) => {
            return removeKnownForActor(actor._id, movies[i]);
          });
        }

        const directorsContainMovie = await Directors.find({
          knownFor: movies[i],
        });

        if (directorsContainMovie.length > 0) {
          directorsContainMovie.filter((director) => {
            return removeKnownForDirector(director._id, movies[i]);
          });
        }

        await Movies.findByIdAndDelete(movies[i]);
      }
      res.json({ msg: "Movies Deleted !" });
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

      // Xóa id phim này ra khỏi mảng knownFor của các diễn viên, đạo diễn trước khi xóa phim.
      const actorsContainMovie = await Actors.find({
        knownFor: req.params.id,
      });

      if (actorsContainMovie.length > 0) {
        actorsContainMovie.filter((actor) => {
          return removeKnownForActor(actor._id, req.params.id);
        });
      }

      const directorsContainMovie = await Directors.find({
        knownFor: req.params.id,
      });

      if (directorsContainMovie.length > 0) {
        directorsContainMovie.filter((director) => {
          return removeKnownForDirector(director._id, req.params.id);
        });
      }

      await Movies.findByIdAndDelete(req.params.id);
      res.json({ msg: "Movie Deleted !" });
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
        year,
        limitAge,
        duration,
        original_country,
        allGenres,
        TMDBid,
        actorsBelongTo,
        directorsBelongTo,
        imdbId,
        imdb_rating,
        original_language,
      } = req.body;

      if (!img || !imgSmall)
        return res
          .status(400)
          .json({ msg: "Backdrop and poster image cannot be empty" });
      if (!trailer)
        return res.status(400).json({ msg: "Trailer link cannot be empty" });
      // Xóa id bộ phim này ra khỏi mảng knownFor cho các diễn viên cũ, thêm vào cho các diễn viên mới.
      // tìm ra trừ của hai mảng.
      // mảng cũ trừ mảng mới (những thằng cần xóa movieId ra khỏi knownFor)
      // mảng mới trừ mảng cũ (những thằng cần thêm movieId vào knownFor)
      const oldMovie = await Movies.findById(req.params.id);
      const { actorsBelongTo: oldActors, directorsBelongTo: oldDirectors } =
        oldMovie;

      handleKnownForActor(oldActors, actorsBelongTo, req.params.id);

      handleKnownForDirector(oldDirectors, directorsBelongTo, req.params.id);

      // sau đó mới cập nhật phim
      await Movies.findOneAndUpdate(
        { _id: req.params.id },
        {
          title: title.toLowerCase(),
          desc,
          img,
          imgSmall,
          trailer,
          year,
          limitAge,
          duration,
          original_country,
          allGenres,
          TMDBid,
          actorsBelongTo,
          directorsBelongTo,
          imdbId,
          imdb_rating,
          original_language,
        }
      );

      res.json({ msg: "Updated a movie!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateMovies: async (req, res) => {
    try {
      let rawdata = fs.readFileSync("./MoviesForUpdate.json");

      let movies = JSON.parse(rawdata);

      await movies.forEach(async (movie, index) => {
        let view = 0;
        if (movie["imdb_rating"]) view = movie["imdb_rating"] * 10;
        console.log(
          `updating ${movie["_id"]} at ${index} / ${movies.length} with ${movie.trailer}`
        );
        const a = await Movies.updateOne(
          { _id: movie["_id"] },
          { trailer: movie.trailer }
        );
      });

      res.json({ msg: "movies Updated" });
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

      await Movies.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.user.id },
        },
        { new: true }
      );

      // trường hợp mà người dùng đã dislike comment trước đó thì:
      const like = await Movies.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { dislikes: req.user.id },
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
      } else {
        // trả score về 0
        await Movies.findOneAndUpdate(
          { _id: req.params.id },
          {
            score: 0,
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

        // có được score rồi thì update score của phim
        await Movies.findOneAndUpdate(
          { _id: req.params.id },
          {
            score: parseFloat(movieScore),
          }
        );
      } else {
        // trả score về 0
        await Movies.findOneAndUpdate(
          { _id: req.params.id },
          {
            score: 0,
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

      await Movies.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { dislikes: req.user.id },
        },
        { new: true }
      );

      // trường hợp mà người dùng đã like comment trước đó thì:
      const dislike = await Movies.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { likes: req.user.id },
        },
        { new: true }
      );

      if (!dislike)
        return res.status(400).json({ msg: "This movie does not exist." });

      const { likes, dislikes } = dislike;

      if (likes.length > 0 || dislikes.length > 0) {
        const movieScore = scoreCalculating(dislike);

        // có được score rồi thì update score của phim
        await Movies.findOneAndUpdate(
          { _id: req.params.id },
          {
            score: parseFloat(movieScore),
          }
        );
      } else {
        // trả score về 0
        await Movies.findOneAndUpdate(
          { _id: req.params.id },
          {
            score: 0,
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

        // có được score rồi thì update score của phim
        await Movies.findOneAndUpdate(
          { _id: req.params.id },
          {
            score: parseFloat(movieScore),
          }
        );
      } else {
        // trả score về 0
        await Movies.findOneAndUpdate(
          { _id: req.params.id },
          {
            score: 0,
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
  getSimilarMovies: async (req, res) => {
    try {
      const { allGenreIDs } = req.body;

      const finalGenreIDs = allGenreIDs.map((genreID) => {
        return ObjectId(genreID);
      });

      const similarMovies = await Movies.aggregate([
        {
          $match: {
            allGenres: {
              $in: [finalGenreIDs],
            },
          },
        },
        { $sort: { createdAt: -1 } },
        { $limit: 10 },
      ]);

      res.status(200).json({ similarMovies });
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

// Hàm xử lí update mảng KnownFor cho actor khi update phim
const handleKnownForActor = (oldActors, actors, movieId) => {
  // mảng cũ trừ mảng mới
  const subtractOldActors = oldActors.filter(
    (item1) => !actors.some((item2) => ObjectId(item1).toString() === item2)
  );

  //  mảng mới trừ mảng cũ
  const subtractNewActors = actors.filter(
    (item1) => !oldActors.some((item2) => item1 === ObjectId(item2).toString())
  );

  subtractOldActors.filter((actorId) => {
    return removeKnownForActor(actorId, movieId);
  });

  subtractNewActors.filter((actorId) => {
    return addKnownForActor(actorId, movieId);
  });
};

// Hàm xử lí update mảng KnownFor cho director khi update phim
const handleKnownForDirector = (oldDirectors, directors, movieId) => {
  // mảng cũ trừ mảng mới
  const subtractOldDirectors = oldDirectors.filter(
    (item1) => !directors.some((item2) => ObjectId(item1).toString() === item2)
  );

  //  mảng mới trừ mảng cũ
  const subtractNewDirectors = directors.filter(
    (item1) =>
      !oldDirectors.some((item2) => item1 === ObjectId(item2).toString())
  );

  subtractOldDirectors.filter((directorId) => {
    return removeKnownForDirector(directorId, movieId);
  });

  subtractNewDirectors.filter((directorId) => {
    return addKnownForDirector(directorId, movieId);
  });
};

// Hàm xử lí delete movieId khỏi mảng KnownFor khi delete phim

// thêm id phim vào mảng Knownfor cho actor
const addKnownForActor = async (actorId, movieId) => {
  await Actors.findOneAndUpdate(
    { _id: actorId },
    {
      $push: { knownFor: movieId },
    },
    { new: true }
  );
};

// xóa id phim ra khỏi mảng Knownfor cho actor
const removeKnownForActor = async (actorId, movieId) => {
  await Actors.findOneAndUpdate(
    { _id: actorId },
    {
      $pull: { knownFor: movieId },
    },
    { new: true }
  );
};

// thêm id phim vào mảng Knownfor cho director
const addKnownForDirector = async (directorId, movieId) => {
  await Directors.findOneAndUpdate(
    { _id: directorId },
    {
      $push: { knownFor: movieId },
    },
    { new: true }
  );
};

// xóa id phim ra khỏi mảng Knownfor cho director
const removeKnownForDirector = async (directorId, movieId) => {
  await Directors.findOneAndUpdate(
    { _id: directorId },
    {
      $pull: { knownFor: movieId },
    },
    { new: true }
  );
};

module.exports = movieController;
