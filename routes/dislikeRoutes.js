const router = require("express").Router();
const dislikeController = require("../controllers/dislikeController");
const auth = require("../middlewares/Auth");

router.post("/unDislike", auth, dislikeController.removeDislike);

router.post("/upDislike", auth, dislikeController.createDislike);

router.get("/getDislikes", dislikeController.getDislikes);

module.exports = router;
