const Dislikes = require("../models/dislikeModel");
const Likes = require("../models/likeModel");

const dislikeController = {
  createDislike: async (req, res) => {
    try {
      const { userId, commentId } = req.body;

      const newDislike = new Dislikes({
        userId,
        commentId,
      });

      await newDislike.save();

      // trường hợp mà người dùng đã like comment trước đó thì:
      await Likes.findOneAndDelete({
        commentId: req.body.commentId,
        userId: req.body.userId,
      });

      res.json({ msg: "Dislike!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  removeDislike: async (req, res) => {
    try {
      await Dislikes.findOneAndDelete({
        commentId: req.body.commentId,
        userId: req.body.userId,
      });

      res.json({ msg: "UnDislike!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getDislikes: async (req, res) => {
    try {
      const dislikes = await Dislikes.find({ commentId: req.body.commentId });
      res.json(dislikes);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = dislikeController;
