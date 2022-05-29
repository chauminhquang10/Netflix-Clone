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
      type: Object,
      default: {},
    },
    buy_package: {
      type: Object,
      default: {},
    },
    favoriteList: {
      type: Array,
      default: [],
    },
    usedDiscounts: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema);
