const Payments = require("../models/paymentModel");
const Users = require("../models/userModel");
const Packages = require("../models/packModel");
const Discount = require("../models/discountModel");

const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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
  getCurrentMonthRevenue: async (req, res) => {
    try {
      const results = await Payments.aggregate([
        {
          $addFields: {
            month: {
              $month: "$createdAt",
            },
            year: {
              $year: "$createdAt",
            },
          },
        },
        {
          $match: {
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
          },
        },
        {
          $group: {
            _id: "$month",
            total: {
              $sum: {
                $subtract: ["$service_pack.price", "$discountPrice"],
              },
            },
          },
        },
      ]);

      if (results.length != 0) {
        return res.status(200).json({ total: results[0].total });
      } else {
        return res.status(200).json({ total: 0 });
      }
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getMonthStats: async (req, res) => {
    try {
      //tinh tổng số tiền payment theo tung thang trong nam hiện tại
      const results = await Payments.aggregate([
        {
          $addFields: {
            month: {
              $month: "$createdAt",
            },
            year: {
              $year: "$createdAt",
            },
          },
        },
        {
          $match: {
            year: new Date().getFullYear(),
          },
        },
        {
          $group: {
            _id: "$month",
            // // hoặc dùng định dạng khác cho ngày tháng năm như sau:
            // _id: { $dateToString: { format: "%m/%d/%Y", date: "$createdAt" } },
            total: {
              $sum: {
                $subtract: ["$service_pack.price", "$discountPrice"],
              },
            },
          },
        },
      ]);

      // đắp những tháng k có số liệu trong năm vào
      const emptyMonthsArr = months.filter(
        (month) => !results.some((result) => result._id == month)
      );

      for (let i = 0; i < emptyMonthsArr.length; i++) {
        results.push({ _id: emptyMonthsArr[i], total: 0 });
      }

      res.status(200).json(results);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getTodayStats: async (req, res) => {
    try {
      //tinh tổng số tiền thu nhập trong ngày hôm nay
      const allPayments = await Payments.find();

      const filterPayments = allPayments.filter((payment) => {
        return (
          new Date().toLocaleDateString() ==
          new Date(payment.createdAt).toLocaleDateString()
        );
      });

      const totalRevenueToday = filterPayments.reduce((prev, payment) => {
        return prev + (payment.service_pack.price - payment.discountPrice);
      }, 0);

      res.status(200).json(totalRevenueToday);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getDiscountsStats: async (req, res) => {
    try {
      // Thống kê số lượng mã giảm giá được khách hàng dùng theo từng tháng trong năm hiện tại.
      const results = await Payments.aggregate([
        {
          $addFields: {
            month: {
              $month: "$createdAt",
            },
            year: {
              $year: "$createdAt",
            },
          },
        },
        {
          $match: {
            year: new Date().getFullYear(),
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: { $size: { $ifNull: ["$discounts", []] } } },
          },
        },
      ]);

      // đắp những tháng k có số liệu trong năm vào
      const emptyMonthsArr = months.filter(
        (month) => !results.some((result) => result._id == month)
      );

      for (let i = 0; i < emptyMonthsArr.length; i++) {
        results.push({ _id: emptyMonthsArr[i], total: 0 });
      }

      res.status(200).json(results);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getDiscountsPriceStats: async (req, res) => {
    try {
      // Thống kê số tiền giảm giá của khách hàng dùng theo từng tháng trong năm hiện tại.
      const results = await Payments.aggregate([
        {
          $addFields: {
            month: {
              $month: "$createdAt",
            },
            year: {
              $year: "$createdAt",
            },
          },
        },
        {
          $match: {
            year: new Date().getFullYear(),
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$discountPrice" },
          },
        },
      ]);

      // đắp những tháng k có số liệu trong năm vào
      const emptyMonthsArr = months.filter(
        (month) => !results.some((result) => result._id == month)
      );

      for (let i = 0; i < emptyMonthsArr.length; i++) {
        results.push({ _id: emptyMonthsArr[i], total: 0 });
      }

      res.status(200).json(results);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getDiscountsQuantityStats: async (req, res) => {
    try {
      // get all discounts coupon
      const allDiscounts = await Discount.find().select("name");

      let allResultArrays = [];

      // nhét tất cả mảng kết quả vào chung 1 mảng to ==> thành mảng 2 chiều
      for (let i = 0; i < allDiscounts.length; i++) {
        let newDiscountName = allDiscounts[i].name
          .replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1);
          })
          .replace(/ /g, "");

        let oneResult = await getSpecificDiscountQuantityStats(
          allDiscounts[i]._id,
          newDiscountName
        );
        allResultArrays.push(oneResult);
      }

      // khởi tạo kết quả bằng mảng đầu tiên trong mảng 2 chiều
      let finalResult = allResultArrays[0];
      // duyệt qua từng phần tử mảng trong mảng 2 chiều để merge các mảng lại dựa trên _id (tháng)
      for (let i = 1; i < allResultArrays.length; i++) {
        mergeByProperty(finalResult, allResultArrays[i], "_id");
      }

      res
        .status(200)
        .json({ finalResult, discountsLength: allDiscounts.length });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getTopUsersStats: async (req, res) => {
    try {
      // Thống kê những top users (tổng lượt payment với tổng số tiền đã tiêu).
      const result = await Payments.aggregate([
        {
          $addFields: {
            year: {
              $year: "$createdAt",
            },
          },
        },
        {
          $match: {
            year: new Date().getFullYear(),
          },
        },
        {
          $group: {
            _id: "$user_id",
            name: {
              $last: "$name",
            },
            avatar: {
              $last: "$avatar",
            },
            totalPayments: { $sum: 1 },
            totalSpending: {
              $sum: {
                $subtract: ["$service_pack.price", "$discountPrice"],
              },
            },
          },
        },
      ]);
      res.status(200).json(result);
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

      const {
        service_pack,
        paymentID,
        address,
        paymentMethod,
        discountPrice,
        discounts,
      } = req.body;
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
        discounts,
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

const mergeByProperty = (target, source, prop) => {
  source.forEach((sourceElement) => {
    let targetElement = target.find((targetElement) => {
      return sourceElement[prop] === targetElement[prop];
    });
    targetElement
      ? Object.assign(targetElement, sourceElement)
      : target.push(sourceElement);
  });
};

const soldUpdate = async (id, oldSold) => {
  await Packages.findOneAndUpdate(
    { _id: id },
    {
      sold: oldSold + 1,
    }
  );
};

// hàm tính số lượng cụ thể 1 loại mã giảm giá được dùng theo từng tháng.
const getSpecificDiscountQuantityStats = async (discountId, discountName) => {
  // Thống kê số lượng từng loại mã giảm giá nào được dùng theo từng tháng trong năm hiện tại.

  const results = await Payments.aggregate([
    {
      $addFields: {
        month: {
          $month: "$createdAt",
        },
        year: {
          $year: "$createdAt",
        },
      },
    },
    {
      $match: {
        "discounts._id": {
          $in: [discountId.toString()],
        },
        year: new Date().getFullYear(),
      },
    },
    {
      $group: {
        _id: "$month",
        [discountName]: { $sum: 1 },
      },
    },
  ]);

  // đắp những tháng k có số liệu trong năm vào
  const emptyMonthsArr = months.filter(
    (month) => !results.some((result) => result._id == month)
  );

  for (let i = 0; i < emptyMonthsArr.length; i++) {
    results.push({ _id: emptyMonthsArr[i], [discountName]: 0 });
  }

  results.sort(function (a, b) {
    return a._id - b._id;
  });

  return results;
};

module.exports = paymentController;
