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
  createPayment: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("name email");
      if (!user) return res.status(400).json({ msg: "User does not exist" });

      const { service_pack, paymentID, address } = req.body;
      const { _id, name, email } = user;

      const newPayment = new Payments({
        user_id: _id,
        name,
        email,
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
