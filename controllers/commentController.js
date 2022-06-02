const Comments = require("../models/commentModel");
const Movies = require("../models/movieModel");

const commentController = {
  createComment: async (req, res) => {
    try {
      const { content, writer, movieId, responseTo, star } = req.body;

      const newComment = new Comments({
        content,
        writer,
        movieId,
        responseTo,
        star,
      });

      const comments = await Comments.find({ movieId });

      const totalStar = comments.reduce((prev, comment) => {
        return prev + comment.star;
      }, 0);

      const calcStar = (totalStar + star) / (comments.length + 1);

      //cập nhật số sao cho phim đang comment sau khi người dùng comment đánh giá.
      movieStarUpdate(movieId, calcStar);

      await newComment.save();

      res.json(newComment);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateComment: async (req, res) => {
    try {
      const { content, star } = req.body;
      await Comments.findOneAndUpdate(
        { _id: req.params.id },
        { content: content.toLowerCase(), star }
      );

      const updateComment = await Comments.findById(req.params.id);

      const { movieId } = updateComment;

      const comments = await Comments.find({
        movieId,
      });

      const totalStar = comments.reduce((prev, comment) => {
        return prev + comment.star;
      }, 0);

      const calcStar = totalStar / comments.length;

      //cập nhật số sao cho phim đang comment sau khi người dùng comment đánh giá.
      movieStarUpdate(movieId, calcStar);

      res.json({ msg: "Updated a comment!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

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
      // cập nhật lại số sao trung bình cho phim (trước khi xóa cái comment này trong database)
      const deleteComment = await Comments.findById(req.params.id);

      const { movieId } = deleteComment;

      const comments = await Comments.find({
        movieId,
      });

      const totalStar = comments.reduce((prev, comment) => {
        return prev + comment.star;
      }, 0);

      let calcStar = 0;

      // chỉ tính lại giá trị trung bình sao khi mảng còn nhiều hơn 1 comment.
      // 1 comment còn này là cái comment mình định xóa.
      if (comments.length > 1) {
        calcStar = (totalStar - deleteComment.star) / (comments.length - 1);
      }

      //cập nhật số sao cho phim đang comment sau khi người dùng comment đánh giá.
      movieStarUpdate(movieId, calcStar);

      deleteChildComment(req.params.id);

      res.json({ msg: "Deleted a comment!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

const movieStarUpdate = async (movieId, calcStar) => {
  await Movies.findOneAndUpdate(
    { _id: movieId },
    {
      rating: calcStar,
    }
  );
};

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
