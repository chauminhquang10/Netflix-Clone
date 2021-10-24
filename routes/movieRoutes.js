const router = require("express").Router();
const movieController = require("../controllers/movieController");
const auth = require("../middlewares/Auth");
const authAdmin = require("../middlewares/AuthAdmin");

router
  .route("/movies")
  .get(movieController.getMovies)
  .post(auth, authAdmin, movieController.createMovie);

router
  .route("/movies/:id")
  .delete(auth, authAdmin, movieController.deleteMovie)
  .put(auth, authAdmin, movieController.updateMovie);

module.exports = router;
