import React, { createContext, useState } from "react";
import MoviesAPI from "./api/MoviesAPI";

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(false);
  const state = {
    token: [token, setToken],
    moviesAPI: MoviesAPI(),
  };

  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
