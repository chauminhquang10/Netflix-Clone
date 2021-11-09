import React from "react";

import { NotificationsNone, Language, Settings } from "@material-ui/icons";
import "./TopBar.css";

const TopBar = () => {
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">Admin</span>
        </div>
        <div className="topRight">
          <div className="topbarIconContainer">
            <NotificationsNone></NotificationsNone>
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Language />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Settings />
          </div>
          <img
            className="topAvatar"
            src="https://res.cloudinary.com/minh-quang-21-kg/image/upload/v1633587460/avatar/b39244lnkpdl8jtgwca3.jpg"
          ></img>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
