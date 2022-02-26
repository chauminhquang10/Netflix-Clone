import { combineReducers } from "redux";

import socket from "./socketReducer";

import notify from "./notifyReducer";

export default combineReducers({
  socket,
  notify,
});
