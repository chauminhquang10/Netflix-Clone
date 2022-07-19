const router = require("express").Router();
const likeController = require("../controllers/likeController");
const auth = require("../middlewares/Auth");

router.post("/upLike", auth, likeController.createLike);

router.post("/unLike", auth, likeController.removeLike);

router.get("/getLikes", likeController.getLikes);

module.exports = router;
