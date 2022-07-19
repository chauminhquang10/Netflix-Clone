import React, { useContext } from "react";
import { GlobalState } from "../../../GlobalState";
import { useSelector, useDispatch } from "react-redux";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import {
  isReadNotify,
  NOTIFY_TYPES,
  deleteAllNotifies,
  deleteOneNotify,
  deleteOneNewNotify,
} from "../../../redux/actions/notifyAction";

import "./NotifyModal.scss";
import MovieNews from "../utils/movie_news/Movie_News_List";

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
    <div
      className="Notify_container"
      style={{ position: "relative", margin: "0 1rem" }}
    >
      <div style={{ position: "relative", margin: "0 1rem" }}>
        <div className="notify_count">{notify.newNotifies.length}</div>
        {notify.sound ? (
          <NotificationsActiveIcon
            style={{ fontSize: "30px", cursor: "pointer" }}
            onClick={handleSound}
          />
        ) : (
          <NotificationsOffIcon
            style={{ fontSize: "30px", cursor: "pointer" }}
            onClick={handleSound}
          />
        )}
      </div>
      <MovieNews
        notify={notify}
        handleIsRead={handleIsRead}
        handleDeleteAll={handleDeleteAll}
        handleDeleteSingleNotify={handleDeleteSingleNotify}
        UserData={userData}
      />
    </div>
  );
};

export default NotifyModal;
