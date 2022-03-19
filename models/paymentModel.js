const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/minh-quang-21-kg/image/upload/v1623416080/avatar/p9npi01sh5awfdsh1yum.jpg",
    },
    paymentID: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    service_pack: {
      type: Object,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payments", paymentSchema);
