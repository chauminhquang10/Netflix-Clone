const mongoose = require("mongoose");

const directorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/minh-quang-21-kg/image/upload/v1623416080/avatar/p9npi01sh5awfdsh1yum.jpg",
    },
    gender: {
      type: String,
      required: true,
    },
    place_of_birth: {
      type: String,
    },
    birthday: {
      type: String,
    },
    biography: {
      type: String,
    },
    knownFor: [{ type: mongoose.Types.ObjectId, ref: "Movie" }],
    tmdbID: {
      type: String,
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

module.exports = mongoose.model("Directors", directorSchema);
