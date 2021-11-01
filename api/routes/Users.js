const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const verify = require("../middlewares/verifyToken");

//update (da co r)
router.put("/:userId", verify, async (req, res) => {
  if (req.user.id === req.params.userId || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(password, 12);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $set: req.body,
        },
        { new: true }
      );
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json({ msg: "You can update only your account!" });
  }
});

//delete (da co r)
router.delete("/:userId", verify, async (req, res) => {
  if (req.user.id === req.params.userId || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.userId);
      return res.status(200).json({ msg: "User has been deleted!" });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json({ msg: "You can delete only your account!" });
  }
});

//get (có r)
router.get("/find/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//get all
// ( có r )
router.get("/", verify, async (req, res) => {
  const query = req.query.new;
  if (req.user.isAdmin) {
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(5)
        : await User.find();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res
      .status(403)
      .json({ msg: "You aren't allowed to see all users!" });
  }
});

//*****( có r)
//get user stats
// lay so lieu thong ke
//  ***dang le ra phai kiem tra admin nữa chứ nhỉ
router.get("/stats", verify, async (req, res) => {
  const today = new Date();
  const lastYear = today.setFullYear(today.setFullYear() - 1);

  try {
    //tinh tong users theo tung thang trong nam
    const data = await User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: {
            $sum: 1,
          },
        },
      },
    ]);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
