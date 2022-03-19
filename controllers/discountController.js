const Discount = require("../models/discountModel");

const discountController = {
  getDiscounts: async (req, res) => {
    try {
      const discounts = await Discount.find();
      res.json(discounts);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createDiscount: async (req, res) => {
    try {
      // if user has role = 1 => admin
      //only admin can create , delete and update discount

      const { name, discountValue, expireTime } = req.body;
      const discount = await Discount.findOne({ name });
      if (discount)
        return res.status(400).json({ msg: "This coupon name already exist" });

      const newDiscount = new Discount({
        name,
        discountValue,
        expireTime,
      });
      await newDiscount.save();
      res.json({ msg: "New coupon code created!" });
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
