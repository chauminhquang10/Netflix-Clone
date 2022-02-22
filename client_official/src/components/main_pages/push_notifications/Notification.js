import React, { useState, useEffect, useContext } from "react";
import "./Notification.css";
import { Notifications, Message, Settings } from "@material-ui/icons";
import PostCard from "./PostCard";
import { posts } from "../../../dummyData";

import { GlobalState } from "../../../GlobalState";

const Notification = ({ socket }) => {
  const [notification, setNotification] = useState([]);
  const [open, setOpen] = useState(false);

  const state = useContext(GlobalState);
  const [userData] = state.usersAPI.userData;

  useEffect(() => {
    if (userData) socket.emit("newUser", userData.name);
  }, [socket, userData]);

  useEffect(() => {
    socket.on("getNotification", (data) => {
      setNotification((prev) => [...prev, data]);
    });
  }, [socket]);

  const handleRead = () => {
    setNotification([]);
    setOpen(false);
  };

  const displayNotification = ({ senderName, type }) => {
    let action;

    if (type === 1) {
      action = "liked";
    } else if (type === 2) {
      action = "commented";
    } else {
      action = "shared";
    }
    return (
      <span className="notification">{`${senderName} ${action} your post.`}</span>
    );
  };

  return (
    <>
      <div className="navbar">
        <span className="logo">Wang App</span>
        <div className="icons">
          <div className="icon" onClick={() => setOpen(!open)}>
            <Notifications style={{ fontSize: "40px", marginLeft: "1.5rem" }} />

            {notification.length > 0 && (
              <div className="counter">{notification.length}</div>
            )}
          </div>
          <div className="icon" onClick={() => setOpen(!open)}>
            <Message style={{ fontSize: "40px", marginLeft: "1.5rem" }} />
          </div>
          <div className="icon" onClick={() => setOpen(!open)}>
            <Settings style={{ fontSize: "40px", marginLeft: "1.5rem" }} />
          </div>
        </div>
      </div>
      {posts.map((post, index) => (
        <PostCard key={index} post={post} socket={socket} userData={userData} />
      ))}
      {open && (
        <div className="notifications">
          {notification.map((n) => displayNotification(n))}
          <button className="nButton" onClick={handleRead}>
            Mark as read
          </button>
        </div>
      )}
    </>
  );
};

export default Notification;
