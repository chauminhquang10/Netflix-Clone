
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import MainHeader from "./components/main_header/MainHeader";
import Pages from "./components/main_pages/Pages";
import OfficialFooter from "./components/official_footer/OfficialFooter";
import { BrowserRouter as Router } from "react-router-dom";

import { useContext } from "react";

import { GlobalState } from "./GlobalState";

import { useSelector, useDispatch } from "react-redux";
import { GLOBALTYPES } from "./redux/actions/globalTypes";

import { getNotifies, getNewNotifies } from "./redux/actions/notifyAction";

import SocketClient from "./SocketClient";

import io from "socket.io-client";

function App() {
  const state = useContext(GlobalState);
  const [token] = state.token;

  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io();
    dispatch({ type: GLOBALTYPES.SOCKET, payload: socket });
    return () => socket.close();
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(getNotifies(token));
      dispatch(getNewNotifies(token));
    }
  }, [dispatch, token]);

  return (
    <>
      <Router>
        {token && <SocketClient></SocketClient>}
        <MainHeader></MainHeader>
        <Pages></Pages>
        <OfficialFooter />
      </Router>
    </>
  );
}

export default App;
