const Likes = require("../models/likeModel");
const Dislikes = require("../models/dislikeModel");

const likeController = {
  createLike: async (req, res) => {
    try {
      const { userId, commentId } = req.body;

      const newLike = new Likes({
        userId,
        commentId,
      });

      await newLike.save();

      // trường hợp mà người dùng đã dislike comment trước đó thì:
      await Dislikes.findOneAndDelete({
        commentId: req.body.commentId,
        userId: req.body.userId,
      });

      res.json({ msg: "Like!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  removeLike: async (req, res) => {
    try {
      await Likes.findOneAndDelete({
        commentId: req.body.commentId,
        userId: req.body.userId,
      });

      res.json({ msg: "Unlike!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getLikes: async (req, res) => {
    try {
      const likes = await Likes.find({ commentId: req.body.commentId });
      res.json(likes);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = likeController;
