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
          res.data?.service_pack && setUserPackage(res.data.service_pack);
          let currentDate = moment().format("MMMM Do YYYY");
          if (res.data?.buy_package) {
            setIsValidAccount(true);
            if (res.data.buy_package.expireTime >= currentDate) {
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
        { watchlist: [...watchList, { ...movie }] },
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
      "/user/addwatchlist",
      { watchlist: watchList },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  };

  const addUserPackageService = async (pack) => {
    let currentDate = moment().format("MMMM Do YYYY");
    let expireDate = moment().add(30, "days").format("MMMM Do YYYY");

    setUserPackage({
      ...pack,
      startedTime: currentDate,
      expireTime: expireDate,
    });

    await axios.patch(
      "/user/addpackage",
      {
        service_pack: {
          ...pack,
          startedTime: currentDate,
          expireTime: expireDate,
        },
      },
      {
        headers: { Authorization: token },
      }
    );
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
  };
};

export default UsersAPI;
