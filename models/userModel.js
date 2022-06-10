const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name!"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email!"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password!"],
    },
    role: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/minh-quang-21-kg/image/upload/v1623416080/avatar/p9npi01sh5awfdsh1yum.jpg",
    },
    service_pack: {
      startedTime: { type: String },
      expireTime: { type: String },
      packId: {
        type: mongoose.Types.ObjectId,
        ref: "Packs",
      },
    },
    buy_package: {
      startedTime: { type: String },
      expireTime: { type: String },
      packId: {
        type: mongoose.Types.ObjectId,
        ref: "Packs",
      },
    },
    favoriteList: [{ type: mongoose.Types.ObjectId, ref: "Movie" }],
    usedDiscounts: {
      type: Array,
      default: [],
    },
    likedGenres: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema);
