import React, { useState, useEffect } from "react";
import axios from "axios";

const UsersAPI = (token) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [watchList, setWatchList] = useState([]);

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
          res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);
        } catch (error) {
          alert(error.response.data.msg);
        }
      };
      getUser();
    }
  }, [token]);

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
  };
};

export default UsersAPI;
