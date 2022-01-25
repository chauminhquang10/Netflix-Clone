const mongoose = require("mongoose");

const packSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
    },
    video_quality: {
      type: String,
      required: true,
    },
    resolution: {
      type: String,
      required: true,
    },
    image: {
      type: Object,
      required: true,
    },
    devices: {
      type: Array,
      default: [],
    },
    checked: {
      type: Boolean,
      default: false,
    },
    sold: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Packs", packSchema);
