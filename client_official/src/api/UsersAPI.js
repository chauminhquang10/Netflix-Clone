import React, { useState, useEffect } from "react";

import moment from "moment";
import axios from "axios";

const UsersAPI = (token) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [watchList, setWatchList] = useState([]);
  const [userData, setUserData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [callback, setCallback] = useState(false);

  const [historyCallback, setHistoryCallback] = useState(false);

  // lưu trạng thái chọn gói của khách hàng
  const [userPackage, setUserPackage] = useState({});

  // kiểm tra trạng thái tài khoản đã mua gói chưa
  const [isValidAccount, setIsValidAccount] = useState(false);

  // kiểm tra trạng thái tài khoản còn hạn hay không? (mặc định là hết hạn)
  const [isNotExpireAccount, setIsNotExpireAccount] = useState(false);

  const [userHistory, setUserHistory] = useState([]);

  const [adminHistory, setAdminHistory] = useState([]);

  // danh sách discounts khách hàng đã dùng.
  const [userDiscounts, setUserDiscounts] = useState([]);

  const [discountCallback, setDiscountCallback] = useState(false);

  // danh sách các thể loại kèm lượt thích (dùng cho model)
  const [likedGenres, setLikedGenres] = useState([]);

  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          const res = await axios.get("/user/infor", {
            headers: {
              Authorization: token,
            },
          });
          setIsLogged(true);
          setWatchList(res.data.favoriteList);
          setUserData(res.data);
          setLikedGenres(res.data.likedGenres);
          res.data?.service_pack && setUserPackage(res.data.service_pack);

          if (res.data?.buy_package) {
            setIsValidAccount(true);

            let currentDate = moment().format("YYYY-MM-DD");

            let expireDate = moment(res.data.buy_package.expireTime).format(
              "YYYY-MM-DD"
            );

            let checkDate = moment(currentDate).isBefore(expireDate);
            let checkSameDate = moment(currentDate).isSame(expireDate);

            if (checkDate || checkSameDate) {
              setIsNotExpireAccount(true);
            }
          }
          res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);
        } catch (error) {
          alert(error.response.data.msg);
        }
      };
      getUser();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      const getUserDiscounts = async () => {
        try {
          const res = await axios.get("/user/discountsInfo", {
            headers: { Authorization: token },
          });
          setUserDiscounts(res.data.usedDiscounts);
        } catch (error) {
          alert(error.response.data.msg);
        }
      };
      getUserDiscounts();
    }
  }, [token, discountCallback]);

  useEffect(() => {
    if (isAdmin && token) {
      const getAllUser = async () => {
        try {
          const res = await axios.get("/user/all_info", {
            headers: { Authorization: token },
          });
          setAllUsers(res.data);
        } catch (error) {
          alert(error.response.data.msg);
        }
      };
      getAllUser();
    }
  }, [token, isAdmin, callback]);

  useEffect(() => {
    if (token) {
      const getUserHistory = async () => {
        if (!isAdmin) {
          const res = await axios.get("/user/history", {
            headers: {
              Authorization: token,
            },
          });
          setUserHistory(res.data);
        }
      };
      getUserHistory();
    }
  }, [token, isAdmin, historyCallback]);

  useEffect(() => {
    if (token) {
      const getAdminHistory = async () => {
        if (isAdmin) {
          const res = await axios.get("/api/payment", {
            headers: {
              Authorization: token,
            },
          });
          setAdminHistory(res.data);
        }
      };
      getAdminHistory();
    }
  }, [token, isAdmin, historyCallback]);

  const addToWatchList = async (movie) => {
    if (!isLogged) {
      return alert("Please login to continue!");
    }
    const check = watchList.every((item) => {
      return item._id !== movie._id;
    });
    if (check) {
      setWatchList([...watchList, { ...movie }]);

      await axios.patch(
        "/user/addwatchlist",
        { movieId: movie._id },
        {
          headers: {
            Authorization: token,
          },
        }
      );
    }
  };

  const removeFromWatchList = async (id) => {
    watchList.forEach((item, index) => {
      if (item._id === id) {
        watchList.splice(index, 1);
      }
    });
    setWatchList([...watchList]);
    await axios.patch(
      "/user/removewatchlist",
      { movieId: id },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  };

  const addUserPackageService = async (pack) => {
    let currentDate = moment().format("YYYY-MM-DD");
    let expireDate = moment().add(30, "days").format("YYYY-MM-DD");

    setUserPackage({
      packId: { ...pack },
      startedTime: currentDate,
      expireTime: expireDate,
    });

    await axios.patch(
      "/user/addpackage",
      {
        service_pack: {
          packId: pack._id,
          startedTime: currentDate,
          expireTime: expireDate,
        },
      },
      {
        headers: { Authorization: token },
      }
    );
  };

  const finishCountdown = async (movieId, movieGenres) => {
    // giao của 2 mảng
    const intersectionResult = likedGenres.filter((item1) =>
      movieGenres.some((item2) => item1.id === item2._id)
    );

    // trừ của 2 mảng
    const subtractResult = movieGenres.filter(
      (item1) => !likedGenres.some((item2) => item1._id === item2.id)
    );

    if (intersectionResult.length > 0) {
      intersectionResult.filter((item) => {
        return plusOneToExistGenre(item.id, likedGenres);
      });
      setLikedGenres([...likedGenres]);

      await axios.patch(
        "/user/countLikes",
        {
          likedGenres: [...likedGenres],
        },
        {
          headers: { Authorization: token },
        }
      );
    }

    if (subtractResult.length > 0) {
      const finalResult = subtractResult.map((item) => ({
        id: item._id,
        viewCount: 1,
      }));
      setLikedGenres([...likedGenres, ...finalResult]);
      await axios.patch(
        "/user/countLikes",
        {
          likedGenres: [...likedGenres, ...finalResult],
        },
        {
          headers: { Authorization: token },
        }
      );
    }

    //cập nhật lượt view cho các thể loại và phim
    await axios.patch(
      "/user/updateViews",
      {
        movieId,
        movieGenres,
      },
      {
        headers: { Authorization: token },
      }
    );
  };

  const plusOneToExistGenre = (itemId, likedGenres) => {
    likedGenres.forEach((item) => {
      if (item.id === itemId) {
        item.viewCount += 1;
      }
    });
  };

  return {
    isLogged: [isLogged, setIsLogged],
    isAdmin: [isAdmin, setIsAdmin],
    isValidAccount: [isValidAccount, setIsValidAccount],
    isNotExpireAccount: [isNotExpireAccount, setIsNotExpireAccount],
    watchList: [watchList, setWatchList],
    addToWatchList: addToWatchList,
    removeFromWatchList: removeFromWatchList,
    addUserPackageService: addUserPackageService,
    userData: [userData, setUserData],
    allUsers: [allUsers, setAllUsers],
    callback: [callback, setCallback],
    userPackage: [userPackage, setUserPackage],
    userHistory: [userHistory, setUserHistory],
    adminHistory: [adminHistory, setAdminHistory],
    historyCallback: [historyCallback, setHistoryCallback],
    userDiscounts: [userDiscounts, setUserDiscounts],
    discountCallback: [discountCallback, setDiscountCallback],
    likedGenres: [likedGenres, setLikedGenres],
    finishCountdown: finishCountdown,
  };
};

export default UsersAPI;
