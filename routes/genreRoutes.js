const router = require("express").Router();
const genreController = require("../controllers/genreController");
const auth = require("../middlewares/Auth");
const authAdmin = require("../middlewares/AuthAdmin");

router
  .route("/genres")
  .get(genreController.getGenres)
  .post(auth, authAdmin, genreController.createGenre);

router
  .route("/genres/:id")
  .delete(auth, authAdmin, genreController.deleteGenre)
  .put(auth, authAdmin, genreController.updateGenre);

module.exports = router;
