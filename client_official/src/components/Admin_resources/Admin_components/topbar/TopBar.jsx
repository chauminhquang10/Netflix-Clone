import React, { useContext } from "react";

import { NotificationsNone, Language, Settings } from "@material-ui/icons";
import "./TopBar.css";
import Userlink from "../../../UserLink/UserLink";
import { GlobalState } from "../../../../GlobalState";
import axios from "axios";

const TopBar = () => {
  const state = useContext(GlobalState);
  const [userData] = state.usersAPI.userData;

  const logoutUser = async () => {
    await axios.get("/user/logout");
    localStorage.clear();
    window.location.href = "/";
  };
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">Admin</span>
        </div>
        <div className="topRight">
          <div className="topbarIconContainer">
            <NotificationsNone style={{ fontSize: "20px" }} />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Language />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Settings />
          </div>
          <Userlink
            logout={logoutUser}
            userName={userData.name}
            userAvatar={userData.avatar}
            userMail={userData.email}
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
