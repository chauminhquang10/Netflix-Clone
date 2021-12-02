import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";
import "./UserLink.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const UserLink = ({ logout, userName, userAvatar, userMail }) => {
  const [avatar1, setAvatar1] = useState(true);
  const [avatar2, setAvatar2] = useState(true);
  const [avatar3, setAvatar3] = useState(true);
  const toggleAvatar1 = () => {
    setTimeout(() => {
      setAvatar1(true);
    }, 1500);
  };
  const toggleAvatar2 = () => {
    setTimeout(() => {
      setAvatar2(true);
    }, 1500);
  };
  return (
    <div>
      <div className="action">
        <div
          className="profile"
          onMouseOver={() => (setAvatar1(false), setAvatar3(false))}
          onMouseLeave={() => (toggleAvatar1(), setAvatar3(true))}
        >
          <img className="profile_Img" src={userAvatar}></img>
        </div>
        <div
          className={
            avatar1 & avatar2 && avatar3
              ? "userlink_menu "
              : "userlink_menu active"
          }
          onMouseOver={() => (setAvatar2(false), setAvatar3(false))}
          onMouseLeave={() => (toggleAvatar2(), setAvatar3(true))}
        >
          <div className="popupProfile">
            <img className="propup_Img" src={userAvatar}></img>
          </div>
          <h3>
            {userName}
            <br></br>
            <span>{userMail}</span>
          </h3>
          <ul>
            <li className="userlink_item">
              <Button style={{ justifyContent: "flex-start" }}>
                <AccountCircleIcon style={{ fill: "#344ceb" }} />
                <Link className="profile-link" to="/profile">
                  My Account
                </Link>
              </Button>
            </li>
            {/* <li className="userlink_item">
              <Button style={{ justifyContent: "flex-start" }}>
                <SettingsIcon style={{ fill: "#344ceb" }} />
                <Link className="profile-link" to="">
                  Setting
                </Link>
              </Button>
            </li> */}
            <li className="userlink_item">
              <Button style={{ justifyContent: "flex-start" }}>
                <LogoutIcon style={{ fill: "#344ceb" }} />
                <Link className="profile-link" onClick={logout}>
                  Logout
                </Link>
              </Button>
            </li>
            <li className="userlink_item">
              <p className="endline_terms">
                <Link className="li-Link" to="">
                  Privacy Policy
                </Link>
                <span className="dot"></span>
                <Link className="li-Link" to="">
                  Terms of Service
                </Link>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserLink;
