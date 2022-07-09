const Notifies = require("../models/notifyModel");
const Users = require("../models/userModel");

const NotifyController = {
  createNotify: async (req, res) => {
    try {
      const { id, url, text, content, image, allGenres } = req.body;

      let finalResults = [];

      // thay vì gửi cho tất cả những user thì chỉ gửi cho những user có top 3 genre yêu thích trong allGenres:
      // chọn ra những thằng k phải admin trước
      const allUsers = await Users.find({ role: 0 });

      // sau đó duyệt qua từng user và xếp theo top 3 lượt viewCount cao nhất
      const sortedUsers = allUsers.map((user) => {
        return sortTop3LikedGenresPerUser(user);
      });

      // // cuối cùng chọn ra những user sẽ được gửi thông báo
      sortedUsers.filter((user) => {
        return checkUserQualified(user, allGenres, finalResults);
      });

      // const allClientUsers = await Users.find({ role: 0 }).select("_id");

      // let allUserIds = allClientUsers.map((user) => {
      //   return user._id;
      // });

      const notify = new Notifies({
        id,
        url,
        recipients: finalResults,
        newToUsers: finalResults,
        text,
        content,
        image,
        user: req.user.id,
      });

      await notify.save();

      return res.json({ notify });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  removeNotify: async (req, res) => {
    try {
      const notify = await Notifies.findOneAndDelete({
        id: req.params.id,
        url: req.query.url,
      });

      return res.json({ notify });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getNotifies: async (req, res) => {
    try {
      const notifies = await Notifies.find({ recipients: req.user.id })
        .sort("-createdAt")
        .populate("user", "avatar name");
      return res.json({ notifies });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getNewNotifies: async (req, res) => {
    try {
      const newNotifies = await Notifies.find({ newToUsers: req.user.id })
        .sort("-createdAt")
        .populate("user", "avatar name");
      return res.json({ newNotifies });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  isReadNotify: async (req, res) => {
    try {
      const notifies = await Notifies.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { seenUsers: req.user.id },
        },
        { new: true }
      );

      return res.json({ notifies });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteAllNotifies: async (req, res) => {
    try {
      const updateNotifies = await Notifies.find({ recipients: req.user.id });

      const deleteNotifies = await Notifies.find({ newToUsers: req.user.id });

      updateNotifies.filter((notify) => {
        return deleteSingleNotify(notify._id, req.user.id);
      });

      deleteNotifies.filter((notify) => {
        return deleteSingleNewNotify(notify._id, req.user.id);
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteOneNotify: async (req, res) => {
    try {
      deleteSingleNotify(req.params.id, req.user.id);

      const deleteNewNotify = await Notifies.findOne({
        _id: req.params.id,
        newToUsers: req.user.id,
      });
      if (deleteNewNotify) {
        deleteSingleNewNotify(req.params.id, req.user.id);
      }

      return res.json({ msg: "Deleted a notify!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  deleteOneNewNotify: async (req, res) => {
    try {
      deleteSingleNewNotify(req.params.id, req.user.id);
      return res.json({ msg: "Deleted a new notify!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteAllNewNotifies: async (req, res) => {
    try {
      const deleteNotifies = await Notifies.find({ newToUsers: req.user.id });

      deleteNotifies.filter((notify) => {
        return deleteSingleNewNotify(notify._id, req.user.id);
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

const deleteSingleNotify = async (notifyId, userId) => {
  await Notifies.findOneAndUpdate(
    { _id: notifyId },
    {
      $pull: { recipients: userId },
    },
    { new: true }
  );
};
const deleteSingleNewNotify = async (notifyId, userId) => {
  await Notifies.findOneAndUpdate(
    { _id: notifyId },
    {
      $pull: { newToUsers: userId },
    },
    { new: true }
  );
};

const checkUserQualified = (userItem, allGenres, finalResults) => {
  if (userItem.likedGenres.length > 0) {
    const intersectionResult = userItem.likedGenres.filter((item1) =>
      allGenres.some((item2) => item1.id === item2)
    );
    if (intersectionResult.length > 0) {
      finalResults.push(userItem._id);
    }
  }
};

const sortTop3LikedGenresPerUser = (user) => {
  user.likedGenres.sort(function (a, b) {
    return b.viewCount - a.viewCount;
  });
  const top3Views = user.likedGenres.slice(0, 3);
  user.likedGenres = top3Views;
  return user;
};

module.exports = NotifyController;
