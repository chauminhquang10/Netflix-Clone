const router = require("express").Router();
const actorController = require("../controllers/actorController");
const auth = require("../middlewares/Auth");
const authAdmin = require("../middlewares/AuthAdmin");

router
  .route("/actors")
  .get(actorController.getActors)
  .post(auth, authAdmin, actorController.createActor);

router
  .route("/actors/:id")
  .delete(auth, authAdmin, actorController.deleteActor)
  .put(auth, authAdmin, actorController.updateActor);

router.route("/loadactors").post(actorController.loadActor);
router
  .route("/updateactors")
  .post(auth, authAdmin, actorController.updateActors);
module.exports = router;
