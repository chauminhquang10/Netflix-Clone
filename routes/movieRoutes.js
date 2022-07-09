const router = require("express").Router();
const movieController = require("../controllers/movieController");
const auth = require("../middlewares/Auth");
const authAdmin = require("../middlewares/AuthAdmin");

router
  .route("/movies/:id")
  .get(movieController.getOneMovie)
  .delete(auth, authAdmin, movieController.deleteMovie)
  .put(auth, authAdmin, movieController.updateMovie);

router
  .route("/movies")
  .get(movieController.getMovies)
  .post(auth, authAdmin, movieController.createMovie)
  .delete(auth, authAdmin, movieController.deleteMovies);

// router.route("/allMovies").get(movieController.getAllMovies);

//  like feature
router.route("/movies/:id/like").patch(auth, movieController.likeMovie);

router.route("/movies/:id/unlike").patch(auth, movieController.unLikeMovie);

// dislike feature
router.route("/movies/:id/dislike").patch(auth, movieController.dislikeMovie);

router
  .route("/movies/:id/unDislike")
  .patch(auth, movieController.unDislikeMovie);

// Thống kê những movie với top views (tổng lượt views cao nhất).
router.get(
  "/topMoviesStats",
  auth,
  authAdmin,
  movieController.getTopMoviesStats
);

router.route("/loadmovies").post(movieController.loadmovies);

router.route("/fetchGenres").post(movieController.fetchGenres);

// Thống kê những top movies với điểm (score) cao nhất để làm bxh bên user.
router.get("/topMoviesRanking", movieController.getRankingMovies);

// lấy những phim cùng thể loại
router.route("/similarMovies/:genreID").get(movieController.getSimilarMovies);

module.exports = router;
