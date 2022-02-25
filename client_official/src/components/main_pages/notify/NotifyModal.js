import React, { useState, useContext, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import { useSelector, useDispatch } from "react-redux";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import CircleIcon from "@mui/icons-material/Circle";

import DeleteIcon from "@material-ui/icons/Delete";

import NoNotice from "../../../images/notice.png";

import moment from "moment";

import {
  isReadNotify,
  NOTIFY_TYPES,
  deleteAllNotifies,
  deleteOneNotify,
  deleteOneNewNotify,
} from "../../../redux/actions/notifyAction";

import "./NotifyModal.css";

import { Link } from "react-router-dom";

const NotifyModal = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [userData] = state.usersAPI.userData;

  const { notify } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleIsRead = (msg, seenUsers) => {
    dispatch(isReadNotify({ msg, token, userData, seenUsers }));

    const checkIsNewNotify = notify.newNotifies.filter(
      (item) => item._id === msg._id
    );
    if (checkIsNewNotify) {
      dispatch(deleteOneNewNotify({ msg, token }));
    }
  };

  const handleDeleteSingleNotify = (item) => {
    //Notify
    const msg = {
      id: item.id,
      url: `/detail/${item.id}`,
    };

    dispatch(deleteOneNotify({ msg, token, item }));
  };

  const handleSound = () => {
    dispatch({ type: NOTIFY_TYPES.UDPDATE_SOUND, payload: !notify.sound });
  };

  const handleDeleteAll = () => {
    const newArr = notify.data.filter(
      (item) => !item.seenUsers.includes(userData._id)
    );
    if (newArr.length === 0) {
      return dispatch(deleteAllNotifies(token));
    }

    if (
      window.confirm(
        `You have ${newArr.length} unread notices. Are you sure that you want to remove them all ?`
      )
    ) {
      return dispatch(deleteAllNotifies(token));
    }
  };

  return (
    <div style={{ minWidth: "280px" }}>
      <div className="notification-container">
        <h3>Notifications</h3>
        {notify.sound ? (
          <NotificationsActiveIcon
            style={{ fontSize: "1.2rem", cursor: "pointer" }}
            onClick={handleSound}
          />
        ) : (
          <NotificationsOffIcon
            style={{ fontSize: "1.2rem", cursor: "pointer" }}
            onClick={handleSound}
          />
        )}
      </div>

      <hr />

      {notify.data.length === 0 && (
        <img
          src={NoNotice}
          alt="NoNotification"
          style={{ width: "100px" }}
        ></img>
      )}

      <div style={{ maxHeight: "calc(100vh-200px)", overflow: "autp" }}>
        {notify.data.map((item, index) => (
          <div key={index} style={{ marginBottom: "3px", padding: "2px" }}>
            <Link
              to={`${item.url}`}
              onClick={() => handleIsRead(item, item.seenUsers)}
            >
              <img src={item.image}></img>

              <div>
                <span>{item.text}</span>
              </div>
              {item.content && <small>{item.content.slice(0, 20)}</small>}
            </Link>

            <DeleteIcon onClick={() => handleDeleteSingleNotify(item)} />
            <small>
              {moment(item.createdAt).fromNow()}
              {!item.seenUsers.includes(userData._id) && <CircleIcon />}
            </small>
          </div>
        ))}
      </div>
      <hr />
      <div onClick={handleDeleteAll}>Delete All</div>
    </div>
  );
};

export default NotifyModal;
