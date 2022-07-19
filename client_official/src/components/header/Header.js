import React, { useState, useContext, useEffect, useRef } from "react";
import { GlobalState } from "../../GlobalState";
import { Menu, Clear } from "@material-ui/icons";
import "./Header.css";
import { Link } from "react-router-dom";
import axios from "axios";
import UserLink from "../UserLink/UserLink";
import "./SearchBar.scss";
import NotifyModal from "../main_pages/notify/NotifyModal";
import logo from "../../images/logo-t-rex.jpg";
import { useHistory } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

const Header = () => {
  const state = useContext(GlobalState);
  const [isValidAccount] = state.usersAPI.isValidAccount;
  const [search, setSearch] = state.moviesAPI.search;
  const [userData] = state.usersAPI.userData;
  const [isLogged] = state.usersAPI.isLogged;
  const [toggleSearch, setToggleSearch] = useState(true);
  const [button, setButton] = useState(true);
  const [toggleMenu, setToggleMenu] = useState(true);
  const headerRef = useRef(null);
  const history = useHistory();
  const [likedGenres, setLikedGenres] = state.usersAPI.likedGenres;

  function OnScroll() {
    if (headerRef.current) {
      if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
      ) {
        headerRef.current.style.backgroundColor = "black";
      } else {
        headerRef.current.style.backgroundColor = "#100a0857";
      }
      if (
        document.body.scrollTop > 1300 ||
        document.documentElement.scrollTop > 1300
      ) {
        headerRef.current.style.display = "none";
      } else if (document.documentElement.scrollTop <= 1000) {
        headerRef.current.style.display = "grid";
      }
    }
  }

  const showButton = () => {
    if (window.innerWidth <= 700) {
      setButton(true);
    } else {
      setButton(false);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener("scroll", OnScroll);

  window.addEventListener("resize", showButton);

  const logoutUser = async () => {
    await axios.get("/user/logout");
    localStorage.clear();
    window.location.href = "/";
  };

  const loggedRouter = () => {
    return (
      <>
        {isValidAccount ? (
          <li style={{ listStyle: "none" }}>
            <UserLink
              userMail={userData.email}
              userName={userData.name}
              logout={logoutUser}
              userAvatar={userData.avatar}
            />
          </li>
        ) : (
          <Link className="header_Link_normal" onClick={logoutUser} to="/">
            <button className="login_btn">Log Out</button>
          </Link>
        )}
      </>
    );
  };

  return (
    <>
      <header className="Mainheader" ref={headerRef}>
        <div className="logo">
          <Link to="/">
            <img className="logoImg" src={logo} alt="logo"></img>
          </Link>
        </div>
        <ul className={toggleMenu ? "header_ul" : "header_ul active"}>
          {isValidAccount && (
            <li className="header_li">
              <Link className="header_Link" to="/movies">
                Movies
              </Link>
            </li>
          )}
          {isValidAccount && (
            <li className="header_li">
              <Link className="header_Link" to="/favorite">
                Favorites
              </Link>
            </li>
          )}
          {/* Phần lịch sử mua gói */}
          {isValidAccount && (
            <li className="header_li">
              <Link className="header_Link" to="/history">
                History
              </Link>
            </li>
          )}
          {button && isValidAccount && (
            <li className="header_li">
              <Link className="header_Link" to="/">
                My Account
              </Link>
            </li>
          )}
          {button && isLogged && (
            <li className="header_li">
              <Link onClick={logoutUser} className="header_Link" to="/">
                Logout
              </Link>
            </li>
          )}
          {button && !isLogged && (
            <li className="header_li">
              <Link to="/login" className="header_Link_normal">
                Login
              </Link>
            </li>
          )}
        </ul>
        <div style={{ display: "grid", justifyContent: "flex-end" }}>
          {isValidAccount && (
            <div
              className={toggleSearch ? "search" : "search open"}
              id="searchBar"
            >
              <input
                type="text"
                value={search}
                placeholder="Search..."
                onChange={(e) => {
                  setSearch(e.target.value.toLowerCase());
                  if (search) history.push(`/search`);
                }}
                className="search-box"
              />

              <div>
                <SearchIcon
                  className="search-button"
                  onClick={() => {
                    setToggleSearch(!toggleSearch);
                  }}
                />
              </div>
            </div>
          )}
        </div>
        {/* Phần thông báo */}
        {isValidAccount && (
          <li className="header_li" style={{ listStyle: "none" }}>
            <NotifyModal></NotifyModal>
          </li>
        )}
        {!button && (
          <div className="header_lastItem">
            {isLogged ? (
              loggedRouter()
            ) : (
              <Link className="header_Link_normal" to="/login">
                <button className="login_btn">SIGN IN</button>
              </Link>
            )}
          </div>
        )}
        {button &&
          (toggleMenu ? (
            <div className="header_lastItem">
              <Menu
                onClick={() => setToggleMenu(false)}
                className="Menu"
              ></Menu>
            </div>
          ) : (
            <div className="header_lastItem">
              <Clear
                onClick={() => setToggleMenu(true)}
                className="Clear"
              ></Clear>
            </div>
          ))}
      </header>
    </>
  );
};

export default Header;
