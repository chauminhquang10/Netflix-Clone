const router = require("express").Router();
const commentController = require("../controllers/commentController");
const auth = require("../middlewares/Auth");

router.post("/saveComment", auth, commentController.createComment);

router.put("/editComment/:id", auth, commentController.updateComment);

router.delete("/deleteComment/:id", auth, commentController.deleteComment);

router.get("/getAllComments/:id", commentController.getAllComments);

module.exports = router;
