const Payments = require("../models/paymentModel");
const Users = require("../models/userModel");
const Packages = require("../models/packModel");

const paymentController = {
  getPayments: async (req, res) => {
    try {
      const payments = await Payments.find();
      res.json(payments);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getNewPayments: async (req, res) => {
    try {
      const payments = await Payments.find()
        .populate("user_id", "avatar")
        .sort("-createdAt")
        .limit(4);
      res.json(payments);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  createPayment: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select(
        "name email avatar"
      );
      if (!user) return res.status(400).json({ msg: "User does not exist" });

      // xóa danh sách mã giảm giá đã dùng
      await Users.findOneAndUpdate(
        { _id: user._id },
        {
          usedDiscounts: [],
        }
      );

      const { service_pack, paymentID, address, paymentMethod, discountPrice } =
        req.body;
      const { _id, name, email, avatar } = user;

      const newPayment = new Payments({
        user_id: _id,
        name,
        email,
        avatar,
        paymentMethod,
        discountPrice,
        address,
        service_pack,
        paymentID,
      });

      soldUpdate(service_pack._id, service_pack.sold);

      await newPayment.save();
      res.json({ msg: "Payment Success" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

const soldUpdate = async (id, oldSold) => {
  await Packages.findOneAndUpdate(
    { _id: id },
    {
      sold: oldSold + 1,
    }
  );
};

module.exports = paymentController;
