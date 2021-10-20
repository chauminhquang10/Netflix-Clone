const router = require("express").Router();
const movieController = require("../controllers/movieController");

router
  .route("/movies")
  .get(movieController.getMovies)
  .post(movieController.createMovie);

router
  .route("/movies/:id")
  .delete(movieController.deleteMovie)
  .put(movieController.updateMovie);

module.exports = router;
