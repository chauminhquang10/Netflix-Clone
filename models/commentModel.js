const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },
    writer: {
      type: Object,
    },
    content: {
      type: String,
    },
    responseTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    star: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comments", commentSchema);
