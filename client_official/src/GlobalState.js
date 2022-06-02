import React, { createContext, useState, useEffect } from "react";
import MoviesAPI from "./api/MoviesAPI";
import UsersAPI from "./api/UsersAPI";
import GenresAPI from "./api/GenresAPI";
import ListsAPI from "./api/ListsAPI";
import PackgesAPI from "./api/PackagesAPI";
import DiscountsAPI from "./api/DiscountsAPI";
import axios from "axios";

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(false);

  const [topRanking, setTopRanking] = useState([]);

  const refreshToken = async () => {
    const res = await axios.get("/user/refresh_token");
    setToken(res.data.accesstoken);

    // auto refresh token
    setTimeout(() => {
      refreshToken();
    }, 10 * 60 * 1000);
  };

  const refreshNewRankingMovies = async () => {
    const res = await axios.get("/api/topMoviesRanking");

    setTopRanking(res.data.topScoreMovies);

    // auto refresh ranking movies
    setTimeout(() => {
      refreshNewRankingMovies();
    }, 1 * 60 * 1000);
  };

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) refreshToken();
  }, []);

  useEffect(() => {
    refreshNewRankingMovies();
  }, []);

  const state = {
    token: [token, setToken],
    topRanking: [topRanking, setTopRanking],
    moviesAPI: MoviesAPI(),
    usersAPI: UsersAPI(token),
    genresAPI: GenresAPI(),
    listsAPI: ListsAPI(),
    packagesAPI: PackgesAPI(),
    discountsAPI: DiscountsAPI(),
  };

  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
