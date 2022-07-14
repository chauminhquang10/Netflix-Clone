const Discount = require("../models/discountModel");
const Users = require("../models/userModel");

const moment = require("moment");

const discountController = {
  getDiscounts: async (req, res) => {
    try {
      const discounts = await Discount.find();
      res.json(discounts);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  verifyDiscount: async (req, res) => {
    try {
      const { name, checkTotalPercents } = req.body;
      const discount = await Discount.findOne({ name: name.toLowerCase() });

      if (!discount)
        return res.status(400).json({ msg: "This coupon doesn't exist!" });

      let currentDate = moment().format("YYYY-MM-DD");
      let discountExpireTime = moment(discount.expireTime).format("YYYY-MM-DD");

      let checkDate = moment(currentDate).isAfter(discountExpireTime);

      if (checkDate) {
        return res.status(400).json({ msg: "This coupon is expired!" });
      }

      const user = await Users.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: "User doesn't exist!" });

      if (user.usedDiscounts.length !== 0) {
        for (let i = 0; i < user.usedDiscounts.length; i++) {
          if (user.usedDiscounts[i]._id.toString() == discount._id.toString()) {
            return res
              .status(400)
              .json({ msg: "You've been used this coupon before!" });
          }
        }
      }

      // ktra xem nhập quá 100% không ?
      if (checkTotalPercents + discount.discountValue > 100) {
        return res
          .status(400)
          .json({ msg: "Maximum value discount is 100% !" });
      }

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          $push: { usedDiscounts: discount },
        },
        { new: true }
      );

      res.json({
        msg: "success",
        discount,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createDiscount: async (req, res) => {
    try {
      // if user has role = 1 => admin
      //only admin can create , delete and update discount

      const { name, discountValue, expireTime } = req.body;
      const discount = await Discount.findOne({ name: name.toLowerCase() });
      if (discount)
        return res.status(400).json({ msg: "This coupon name already exist" });

      const newDiscount = new Discount({
        name: name.toLowerCase(),
        discountValue,
        expireTime,
      });
      const createdDiscount = await newDiscount.save();
      res.json({ msg: "New coupon code created!", createdDiscount });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteDiscount: async (req, res) => {
    try {
      await Discount.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted a coupon !" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateDiscount: async (req, res) => {
    try {
      const { name, discountValue, expireTime } = req.body;

      await Discount.findByIdAndUpdate(
        { _id: req.params.id },
        { name, discountValue, expireTime }
      );
      res.json({ msg: "Updated a coupon !" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = discountController;
