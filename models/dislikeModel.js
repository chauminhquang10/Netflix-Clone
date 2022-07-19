const mongoose = require("mongoose");
const dislikeSchema = new mongoose.Schema(
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

module.exports = mongoose.model("Dislikes", dislikeSchema);
