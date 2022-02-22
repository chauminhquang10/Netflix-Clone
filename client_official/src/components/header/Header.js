import React, { useState, useContext, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../../GlobalState";
import { Menu, Clear, ContactSupportOutlined } from "@material-ui/icons";
import "./Header.css";
import { Link } from "react-router-dom";
import { ArrowDropDown } from "@material-ui/icons";
import axios from "axios";
import UserLink from "../UserLink/UserLink";
import "./SearchBar.scss";
import { Notifications } from "@material-ui/icons";
import NotifyModal from "../main_pages/notify/NotifyModal";

import { deleteAllNewNotifies } from "../../redux/actions/notifyAction";

const Header = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [search, setSearch] = state.moviesAPI.search;
  const [userData] = state.usersAPI.userData;
  const [isLogged] = state.usersAPI.isLogged;
  const [isAdmin] = state.usersAPI.isAdmin;
  const [watchList] = state.usersAPI.watchList;
  const [toggleSearch, setToggleSearch] = useState(true);
  const [button, setButton] = useState(true);
  const [toggleMenu, setToggleMenu] = useState(true);
  const headerRef = useRef(null);

  // phần thông báo
  const { notify, newNotifies } = useSelector((state) => state);
  const dispatch = useDispatch();

  function OnScroll() {
    if (headerRef.current) {
      if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
      ) {
        headerRef.current.style.backgroundColor = "black";
      } else {
        headerRef.current.style.backgroundColor = "transparent";
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
        <li style={{ listStyle: "none" }}>
          <UserLink
            userMail={userData.email}
            userName={userData.name}
            logout={logoutUser}
            userAvatar={userData.avatar}
          />
        </li>
      </>
    );
  };

  const handleClickNewNotifies = () => {
    //đóng cái dropdown navbar lại
    //rồi sau đó

    if (newNotifies.length !== 0) {
      dispatch(deleteAllNewNotifies(token));
    }
  };

  return (
    <>
      <header className="Mainheader" ref={headerRef}>
        <div className="logo">
          <Link to="/">
            <img
              className="logoImg"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png"
              alt="logo"
            ></img>
          </Link>
        </div>
        <ul className={toggleMenu ? "header_ul" : "header_ul active"}>
          {isLogged && (
            <li className="header_li">
              <Link className="header_Link" to="/movies">
                Movies
              </Link>
            </li>
          )}
          {isLogged && (
            <li className="header_li">
              <Link className="header_Link" to="/favorite">
                Favorites
              </Link>
            </li>
          )}

          {/* Thử nghiệm mua gói */}
          {isLogged && (
            <li className="header_li">
              <Link className="header_Link" to="/packages">
                Packages
              </Link>
            </li>
          )}

          {/* Phần lịch sử mua gói */}
          {isLogged && (
            <li className="header_li">
              <Link className="header_Link" to="/history">
                History
              </Link>
            </li>
          )}

          {/* Phần thông báo */}
          {isLogged && (
            <li className="header_li">
              {/* <span className="header_Link">{notify.data.length}</span> */}
              <span className="header_Link" onClick={handleClickNewNotifies}>
                {notify.newNotifies.length}
              </span>
              <NotifyModal></NotifyModal>
            </li>
          )}

          {button && (
            <li className="header_li">
              <Link className="header_Link" to="/">
                Setting
              </Link>
            </li>
          )}
          {button && isLogged && (
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
              <Link to="/login" className="header_Link" to="/">
                Login
              </Link>
            </li>
          )}
        </ul>
        <div style={{ display: "grid", justifyContent: "flex-end" }}>
          {isLogged && (
            <div class={toggleSearch ? "search" : "search open"} id="searchBar">
              <input
                type="text"
                value={search}
                placeholder="Search..."
                onChange={(e) => setSearch(e.target.value.toLowerCase())}
                class="search-box"
              />

              <Link to="/movies">
                <span
                  onClick={() => {
                    setToggleSearch(!toggleSearch);
                  }}
                  class="search-button"
                >
                  <span class="search-icon"></span>
                </span>
              </Link>
            </div>
          )}
        </div>
        <Notifications style={{ fontSize: "40px", marginLeft: "1.5rem" }} />
        {!button && (
          <div className="header_lastItem">
            {isLogged ? (
              loggedRouter()
            ) : (
              <Link className="header_Link" to="/login">
                <button className="login_btn">Sign in</button>
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
