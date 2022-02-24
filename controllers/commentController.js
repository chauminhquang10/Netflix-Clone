const Comments = require("../models/commentModel");
const Movies = require("../models/movieModel");

const commentController = {
  createComment: async (req, res) => {
    try {
      const { content, writer, movieId, responseTo } = req.body;

      const newComment = new Comments({
        content,
        writer,
        movieId,
        responseTo,
      });

      // const calcStar = (totalStar + star) / (length + 1);

      // // cập nhật số sao cho sản phẩm đang comment sau khi người dùng comment đánh giá.
      // productStarUpdate(about, calcStar);

      await newComment.save();

      res.json(newComment);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateComment: async (req, res) => {},
  getAllComments: async (req, res) => {
    try {
      const comments = await Comments.find({ movieId: req.params.id });
      res.json({
        length: comments.length,
        comments: comments,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteComment: async (req, res) => {
    try {
      deleteChildComment(req.params.id);
      res.json({ msg: "Deleted a comment!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

// const productStarUpdate = async (about, calcStar) => {
//   await Products.findOneAndUpdate(
//     { _id: about },
//     {
//       star: calcStar,
//     }
//   );
// };

const deleteChildComment = async (commentId) => {
  await Comments.findByIdAndDelete({ _id: commentId });

  const childComments = await Comments.find({
    responseTo: commentId,
  });
  if (childComments) {
    childComments.filter((comment) => {
      return deleteChildComment(comment._id);
    });
  } else return;
};

module.exports = commentController;
