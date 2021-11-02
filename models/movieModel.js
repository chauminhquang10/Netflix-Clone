const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    img: {
      type: Object,
      required: true,
    },
    trailer: {
      type: Object,
    },
    video: {
      type: Object,
    },
    year: {
      type: Number,
      required: true,
    },
    limitAge: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Movie", MovieSchema);
