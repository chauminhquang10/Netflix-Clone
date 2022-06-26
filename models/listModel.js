const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    genre: { type: mongoose.Types.ObjectId, ref: "Genre", required: true },
    items: {
      type: Array,
      default: [],
    },
    checked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("List", ListSchema);
