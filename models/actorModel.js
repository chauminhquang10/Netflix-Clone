const mongoose = require("mongoose");

const actorSchema = new mongoose.Schema(
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
        "https://res.cloudinary.com/minh-quang-21-kg/image/upload/v1655541960/movie/unknown_p0ax5n.jpg",
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

module.exports = mongoose.model("Actors", actorSchema);
