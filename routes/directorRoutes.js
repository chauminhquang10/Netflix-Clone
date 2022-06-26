const router = require("express").Router();
const directorController = require("../controllers/directorController");
const auth = require("../middlewares/Auth");
const authAdmin = require("../middlewares/AuthAdmin");

router
  .route("/directors")
  .get(directorController.getDirectors)
  .post(auth, authAdmin, directorController.createDirector);

router
  .route("/directors/:id")
  .delete(auth, authAdmin, directorController.deleteDirector)
  .put(auth, authAdmin, directorController.updateDirector);

router
  .route("/loaddirectors")
  .post(auth, authAdmin, directorController.deleteDirectors);

router.route("/updatedirectors").post(directorController.updateDirectors);
module.exports = router;
