import React, { createContext, useState, useEffect } from "react";
import MoviesAPI from "./api/MoviesAPI";
import UsersAPI from "./api/UsersAPI";
import GenresAPI from "./api/GenresAPI";
import ListsAPI from "./api/ListsAPI";
import axios from "axios";

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(false);

  const refreshToken = async () => {
    const res = await axios.get("/user/refresh_token");
    setToken(res.data.accesstoken);

    // auto refresh token
    setTimeout(() => {
      refreshToken();
    }, 10 * 60 * 1000);
  };

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) refreshToken();
  }, []);

  const state = {
    token: [token, setToken],
    moviesAPI: MoviesAPI(),
    usersAPI: UsersAPI(token),
    genresAPI: GenresAPI(),
    listsAPI: ListsAPI(),
  };

  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
