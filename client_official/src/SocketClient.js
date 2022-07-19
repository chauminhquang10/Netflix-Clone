import React, { useEffect, useContext, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "./GlobalState";
import { NOTIFY_TYPES } from "./redux/actions/notifyAction";

import audioBell from "./audio/audio_got-it-done-613.mp3";

const SocketClient = () => {
  const { socket, notify } = useSelector((state) => state);
  const dispatch = useDispatch();

  const audioRef = useRef();

  const state = useContext(GlobalState);
  const [userData] = state.usersAPI.userData;

  // join users
  useEffect(() => {
    socket.emit("joinUser", userData._id);
  }, [socket, userData._id]);

  //Notification
  useEffect(() => {
    socket.on("createNotifyToClient", (msg) => {
      dispatch({ type: NOTIFY_TYPES.CREATE_NOTIFY, payload: msg });

      if (notify.sound) {
        audioRef.current.play();
      }
    });

    return () => socket.off("createNotifyToClient");
  }, [socket, dispatch, notify.sound]);

  useEffect(() => {
    socket.on("removeNotifyToClient", (msg) => {
      dispatch({ type: NOTIFY_TYPES.REMOVE_NOTIFY, payload: msg });
    });

    return () => socket.off("removeNotifyToClient");
  }, [socket, dispatch]);

  return (
    <>
      <audio controls ref={audioRef} style={{ display: "none" }}>
        <source src={audioBell} type="audio/mp3"></source>
      </audio>
    </>
  );
};

export default SocketClient;
