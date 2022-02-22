import { GLOBALTYPES } from "./globalTypes";
import {
  postDataAPI,
  getDataAPI,
  deleteDataAPI,
  patchDataAPI,
} from "../utils/fetchData";

export const NOTIFY_TYPES = {
  GET_NOTIFIES: "GET_NOTIFIES",
  GET_NEW_NOTIFIES: "GET_NEW_NOTIFIES",
  CREATE_NOTIFY: "CREATE_NOTIFY",
  REMOVE_NOTIFY: "REMOVE_NOTIFY",
  UDPDATE_NOTIFY: "UDPDATE_NOTIFY",
  UDPDATE_SOUND: "UDPDATE_SOUND",
  DELETE_ALL_NOTIFIES: "DELETE_ALL_NOTIFIES",
  DELETE_ALL_NEW_NOTIFIES: "DELETE_ALL_NEW_NOTIFIES",
};

export const createNotify =
  ({ msg, socket, token, userData }) =>
  async (dispatch) => {
    try {
      const res = await postDataAPI("notify", msg, token);

      socket.emit("createNotify", {
        ...res.data.notify,
        user: {
          username: userData.name,
          avatar: userData.avatar,
        },
      });
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

export const removeNotify =
  ({ msg, socket, token }) =>
  async (dispatch) => {
    try {
      const res = await deleteDataAPI(`notify/${msg.id}?url=${msg.url}`, token);

      socket.emit("removeNotify", {
        ...msg,
        recipients: res.data.notify.recipients,
      });
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

export const getNotifies = (token) => async (dispatch) => {
  try {
    const res = await getDataAPI("notifies", token);

    dispatch({ type: NOTIFY_TYPES.GET_NOTIFIES, payload: res.data.notifies });
  } catch (error) {
    alert(error.response.data.msg);
  }
};

export const getNewNotifies = (token) => async (dispatch) => {
  try {
    const res = await getDataAPI("newNotifies", token);
    dispatch({
      type: NOTIFY_TYPES.GET_NEW_NOTIFIES,
      payload: res.data.newNotifies,
    });
  } catch (error) {
    alert(error.response.data.msg);
  }
};

export const isReadNotify =
  ({ msg, token, userData, seenUsers }) =>
  async (dispatch) => {
    dispatch({
      type: NOTIFY_TYPES.UDPDATE_NOTIFY,
      payload: { ...msg, seenUsers: [...seenUsers, userData._id] },
    });
    try {
      await patchDataAPI(`/readNotify/${msg._id}`, null, token);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

export const deleteAllNotifies = (token) => async (dispatch) => {
  dispatch({
    type: NOTIFY_TYPES.DELETE_ALL_NOTIFIES,
    payload: [],
  });
  try {
    await patchDataAPI("/deleteAllNotifies", null, token);
  } catch (error) {
    alert(error.response.data.msg);
  }
};

export const deleteOneNotify =
  ({ msg, token, item }) =>
  async (dispatch) => {
    dispatch({ type: NOTIFY_TYPES.REMOVE_NOTIFY, payload: msg });
    try {
      await patchDataAPI(`/notify/${item._id}`, null, token);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

export const deleteAllNewNotifies = (token) => async (dispatch) => {
  dispatch({ type: NOTIFY_TYPES.DELETE_ALL_NEW_NOTIFIES, payload: [] });
  try {
    await patchDataAPI("/deleteAllNewNotifies", null, token);
  } catch (error) {
    alert(error.response.data.msg);
  }
};
