import React, { useContext, useState } from "react";
import { GlobalState } from "../../GlobalState";
import { Menu, Clear } from "@material-ui/icons";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  const value = useContext(GlobalState);
  return (
    <header>
      <div className="menu">
        <Menu></Menu>
      </div>
      <div className="logo">
        <h1>
          <Link to="/">Netflix Clone</Link>
        </h1>
      </div>
      <ul>
        <li>
          <Link to="/">Movies</Link>
        </li>
        <li>
          <Link to="/favorites">Favorites</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
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
