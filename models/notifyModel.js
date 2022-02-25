const mongoose = require("mongoose");

const NotifySchema = new mongoose.Schema(
  {
    id: mongoose.Types.ObjectId,
    user: { type: mongoose.Types.ObjectId, ref: "Users" },
    recipients: [{ type: mongoose.Types.ObjectId, ref: "Users" }],
    seenUsers: [{ type: mongoose.Types.ObjectId, ref: "Users" }],
    newToUsers: [{ type: mongoose.Types.ObjectId, ref: "Users" }],
    url: String,
    text: String,
    content: String,
    image: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notify", NotifySchema);
