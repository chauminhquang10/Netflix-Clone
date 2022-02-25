const mongoose = require("mongoose");
const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Likes", likeSchema);
