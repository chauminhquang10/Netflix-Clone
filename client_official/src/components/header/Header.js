import React, { useContext, useState } from "react";
import { GlobalState } from "../../GlobalState";
import { Menu, Clear } from "@material-ui/icons";
import "./Header.css";
import { Link } from "react-router-dom";
import { ArrowDropDown } from "@material-ui/icons";
import axios from "axios";

const Header = () => {
  const state = useContext(GlobalState);

  const [isLogged] = state.usersAPI.isLogged;
  const [isAdmin] = state.usersAPI.isAdmin;
  const [watchList] = state.usersAPI.watchList;
  const [userData] = state.usersAPI.userData;

  const logoutUser = async () => {
    await axios.get("/user/logout");
    localStorage.clear();
    window.location.href = "/";
  };

  const adminRouter = () => {
    return (
      <>
        <li>
          <Link to="/create_movie">Create Movie</Link>
        </li>
        <li>
          <Link to="/genre">Genres</Link>
        </li>
      </>
    );
  };

  const loggedRouter = () => {
    return (
      <>
        <li className="drop-nav">
          <Link to="#" className="avatar">
            <img src={userData.avatar} alt="" className="avatar-img" />
            {userData.name}
            <ArrowDropDown />
          </Link>
          <ul className="dropdown">
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/" onClick={logoutUser}>
                Logout
              </Link>
            </li>
          </ul>
        </li>
      </>
    );
  };

  return (
    <header>
      <div className="menu">
        <Menu></Menu>
      </div>
      <div className="logo">
        <h1>
          <Link to="/">{isAdmin ? "Admin" : "Netflix Clone"}</Link>
        </h1>
      </div>
      <ul>
        <li>
          <Link to="/">Movies</Link>
        </li>

        {!isAdmin && (
          <li>
            <Link to="/favorite">Favorites</Link>
            <span>{watchList.length}</span>
          </li>
        )}

        {isAdmin && adminRouter()}

        {isLogged ? (
          loggedRouter()
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}

        <li>
          <div className="menu">
            <Clear className="menu"></Clear>
          </div>
        </li>
      </ul>
    </header>
  );
};

export default Header;
