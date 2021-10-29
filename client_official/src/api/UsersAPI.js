import React, { useState, useEffect } from "react";
import axios from "axios";

const UsersAPI = (token) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [watchList, setWatchList] = useState([]);
  const [userData, setUserData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [callback, setCallback] = useState(false);

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
    } else {
      alert("This movie has been added to your watchlist!");
    }
  };

  return {
    isLogged: [isLogged, setIsLogged],
    isAdmin: [isAdmin, setIsAdmin],
    watchList: [watchList, setWatchList],
    addToWatchList: addToWatchList,
    userData: [userData, setUserData],
    allUsers: [allUsers, setAllUsers],
    callback: [callback, setCallback],
  };
};

export default UsersAPI;
