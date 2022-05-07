const Users = require("../models/userModel");
const Payments = require("../models/paymentModel");
const Movies = require("../models/movieModel");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const sendEmail = require("./sendMail");

const sendConfirmMail = require("./sendConfirmMail");

const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const fetch = require("node-fetch");
const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID);

const { CLIENT_URL } = process.env;

let ObjectId = require("mongoose").Types.ObjectId;

const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const userController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ msg: "Please fill in all fields" });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ msg: "Invalid email" });
      }

      const checkName = await Users.findOne({ name });
      if (checkName) {
        return res.status(400).json({ msg: "This name has been used!" });
      }

      const user = await Users.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "This email already existed!" });
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ msg: "Password must be at least 6 characters" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = {
        name,
        email,
        password: hashedPassword,
      };

      const activation_token = createActivationToken(newUser);

      const url = `${CLIENT_URL}/user/activate/${activation_token}`;
      sendEmail(email, url, "Verify your email address");

      res.json({
        msg: "Register success! Please activate your account to start",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  activateEmail: async (req, res) => {
    try {
      const { activation_token } = req.body;
      const user = jwt.verify(
        activation_token,
        process.env.ACTIVATION_TOKEN_SECRET
      );

      const { name, email, password } = user;

      const check = await Users.findOne({ email });

      if (check)
        return res.status(400).json({ msg: "This email already existed!" });

      const newUser = new Users({
        name,
        email,
        password,
      });

      await newUser.save();

      res.json({ msg: "Account has been activated!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  sendPaymentConfirmMail: async (req, res) => {
    try {
      const {
        country_code,
        paymentID,
        service_pack,
        beforeDiscount,
        afterDiscount,
      } = req.body;

      const user = await Users.findById(req.user.id).select("name email");
      if (!user) return res.status(400).json({ msg: "User does not exist!" });

      let currentDate = new Date().toLocaleString();
      const { name, email } = user;

      sendConfirmMail(
        email,
        name,
        country_code,
        paymentID,
        service_pack,
        currentDate,
        beforeDiscount,
        afterDiscount
      );
      res.json({ msg: "Send confirm email about the payment successfully!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });

      if (!user)
        return res.status(400).json({ msg: "This email does not exist." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "Password is incorrect" });

      const refresh_token = createRefreshToken({ id: user._id });
      res.cookie("refreshToken", refresh_token, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({ msg: "Login successfully!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getAccessToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshToken;
      if (!rf_token) return res.status(400).json({ msg: "Please login now!" });
      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(400).json({ msg: "Please login now!" });
        const accesstoken = createAccessToken({ id: user.id });
        res.json({ accesstoken });
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await Users.findOne({ email });
      if (!user)
        return res.status(400).json({ msg: "This email does not exist." });

      const access_token = createAccessToken({ id: user._id });
      const url = `${CLIENT_URL}/user/reset/${access_token}`;

      sendEmail(email, url, "Reset your password");
      res.json({ msg: "Resend the password , please check your email" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          password: hashedPassword,
        }
      );
      res.json({ msg: "Password updated !" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getUserInfo: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");
      if (!user) return res.status(400).json({ msg: "User doesn't exist!" });
      res.json(user);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getUserDiscountsInfo: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("usedDiscounts");
      if (!user) return res.status(400).json({ msg: "User doesn't exist!" });
      res.json(user);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getAllUsersInfo: async (req, res) => {
    try {
      const users = await Users.find().select("-password");
      res.json(users);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshToken", { path: "/user/refresh_token" });
      return res.json({ msg: "Logged out!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateUserInfo: async (req, res) => {
    try {
      const { name, avatar } = req.body;
      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          name,
          avatar,
        }
      );
      res.json({ msg: "User Info Updated!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateUsersRole: async (req, res) => {
    try {
      const { role } = req.body;
      await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          role,
        }
      );
      res.json({ msg: "User Role Updated!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      await Users.findByIdAndDelete(req.params.id);
      res.json({ msg: "User Deleted!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  googleLogin: async (req, res) => {
    try {
      const { tokenId } = req.body;
      const verify = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.MAILING_SERVICE_CLIENT_ID,
      });

      const { email_verified, email, name, picture } = verify.payload;

      const password = email + process.env.GOOGLE_SECRET;
      const passwordHash = await bcrypt.hash(password, 12);

      if (!email_verified)
        return res.status(400).json({ msg: "Email verification failed" });

      const user = await Users.findOne({ email });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({ msg: "Password is incorrect" });
        const refresh_token = createRefreshToken({ id: user._id });
        res.cookie("refreshToken", refresh_token, {
          httpOnly: true,
          path: "/user/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ msg: "Login successfully!" });
      } else {
        const newUser = new Users({
          name,
          email,
          password: passwordHash,
          avatar: picture,
        });
        await newUser.save();
        const refresh_token = createRefreshToken({ id: newUser._id });
        res.cookie("refreshToken", refresh_token, {
          httpOnly: true,
          path: "/user/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.json({ msg: "Login successfully!" });
      }
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  facebookLogin: async (req, res) => {
    try {
      const { accessToken, userID } = req.body;

      const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`;

      const data = await fetch(URL)
        .then((res) => res.json())
        .then((res) => {
          return res;
        });

      const { email, name, picture } = data;

      const password = email + process.env.FACEBOOK_SECRET;
      const passwordHash = await bcrypt.hash(password, 12);

      const user = await Users.findOne({ email });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({ msg: "Password is incorrect" });
        const refresh_token = createRefreshToken({ id: user._id });
        res.cookie("refreshToken", refresh_token, {
          httpOnly: true,
          path: "/user/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ msg: "Login successfully!" });
      } else {
        const newUser = new Users({
          name,
          email,
          password: passwordHash,
          avatar: picture.data.url,
        });
        await newUser.save();
        const refresh_token = createRefreshToken({ id: newUser._id });
        res.cookie("refreshToken", refresh_token, {
          httpOnly: true,
          path: "/user/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.json({ msg: "Login successfully!" });
      }
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  addWatchList: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: "User doesn't exist!" });
      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          favoriteList: req.body.watchlist,
        }
      );
      return res.json({ msg: "Added to watchlist" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  addPackage: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: "User doesn't exist!" });

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          service_pack: req.body.service_pack,
        }
      );
      return res.json({ msg: "Buy a package" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  buyPackage: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: "User doesn't exist!" });

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          buy_package: req.body.buy_package,
        }
      );
      return res.json({ msg: "Save Account State!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  cancelCoupon: async (req, res) => {
    try {
      const { codeID } = req.body;

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          $pull: {
            usedDiscounts: { _id: new ObjectId(codeID) },
          },
        },
        { new: true }
      );

      res.json({ msg: "Cancel code successfully!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getHistory: async (req, res) => {
    try {
      const history = await Payments.find({ user_id: req.user.id });

      res.json(history);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserStats: async (req, res) => {
    try {
      //tinh tong users theo tung thang trong nam
      const data = await Users.aggregate([
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
            role: 0,
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

      // đắp những tháng k có số liệu trong năm vào
      const emptyMonthsArr = months.filter(
        (month) => !data.some((item) => item._id == month)
      );

      for (let i = 0; i < emptyMonthsArr.length; i++) {
        data.push({ _id: emptyMonthsArr[i], total: 0 });
      }

      res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getNewUsers: async (req, res) => {
    try {
      const users = await Users.find({ role: 0 }).sort({ _id: -1 }).limit(5);
      res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  countUserLikes: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: "User doesn't exist!" });

      // cập nhật danh sách thể loại với số lượt viewcount
      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          likedGenres: req.body.likedGenres,
        }
      );

      // cập nhật số lượt xem cho phim tương ứng.
      const updateMovie = await Movies.findById(req.body.movieId);

      const { views } = updateMovie;

      await Movies.findOneAndUpdate(
        { _id: req.body.movieId },
        {
          views: views + 1,
        }
      );

      return res.json({ msg: "Count user like up!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: "5m",
  });
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "11m",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

module.exports = userController;

// const Users = require("../models/userModel");

// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// const userCtrl = {
//   register: async (req, res) => {
//     try {
//       const { name, email, password } = req.body;

//       const user = await Users.findOne({ email });
//       if (user)
//         return res.status(400).json({ msg: "The email already exists." });

//       if (password.length < 6)
//         return res
//           .status(400)
//           .json({ msg: "Password is at least 6 characters long." });

//       // Password Encryption
//       const passwordHash = await bcrypt.hash(password, 10);
//       const newUser = new Users({
//         name,
//         email,
//         password: passwordHash,
//       });

//       // Save mongodb
//       await newUser.save();

//       // Then create jsonwebtoken to authentication
//       const accesstoken = createAccessToken({ id: newUser._id });
//       const refreshtoken = createRefreshToken({ id: newUser._id });

//       res.cookie("refreshtoken", refreshtoken, {
//         httpOnly: true,
//         path: "/user/refresh_token",
//         maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
//       });

//       res.json({ accesstoken });
//     } catch (err) {
//       return res.status(500).json({ msg: err.message });
//     }
//   },
//   login: async (req, res) => {
//     try {
//       const { email, password } = req.body;

//       const user = await Users.findOne({ email });
//       if (!user) return res.status(400).json({ msg: "User does not exist." });

//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) return res.status(400).json({ msg: "Incorrect password." });

//       // If login success , create access token and refresh token
//       const accesstoken = createAccessToken({ id: user._id });
//       const refreshtoken = createRefreshToken({ id: user._id });

//       res.cookie("refreshtoken", refreshtoken, {
//         httpOnly: true,
//         path: "/user/refresh_token",
//         maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
//       });

//       res.json({ accesstoken });
//     } catch (err) {
//       return res.status(500).json({ msg: err.message });
//     }
//   },
//   logout: async (req, res) => {
//     try {
//       res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
//       return res.json({ msg: "Logged out" });
//     } catch (err) {
//       return res.status(500).json({ msg: err.message });
//     }
//   },
//   refreshToken: (req, res) => {
//     try {
//       const rf_token = req.cookies.refreshtoken;
//       if (!rf_token)
//         return res.status(400).json({ msg: "Please Login or Register" });

//       jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//         if (err)
//           return res.status(400).json({ msg: "Please Login or Register" });

//         const accesstoken = createAccessToken({ id: user.id });

//         res.json({ accesstoken });
//       });
//     } catch (err) {
//       return res.status(500).json({ msg: err.message });
//     }
//   },
//   getUser: async (req, res) => {
//     try {
//       const user = await Users.findById(req.user.id).select("-password");
//       if (!user) return res.status(400).json({ msg: "User does not exist." });

//       res.json(user);
//     } catch (err) {
//       return res.status(500).json({ msg: err.message });
//     }
//   },
//   addWatchList: async (req, res) => {
//     try {
//       const user = await Users.findById(req.user.id);
//       if (!user) return res.status(400).json({ msg: "User doesn't exist!" });
//       await Users.findOneAndUpdate(
//         { _id: req.user.id },
//         {
//           favoriteList: req.body.watchlist,
//         }
//       );
//       return res.json({ msg: "Added to watchlist" });
//     } catch (err) {
//       return res.status(500).json({ msg: err.message });
//     }
//   },
// };

// const createAccessToken = (user) => {
//   return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "11m" });
// };
// const createRefreshToken = (user) => {
//   return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
// };

// module.exports = userCtrl;
