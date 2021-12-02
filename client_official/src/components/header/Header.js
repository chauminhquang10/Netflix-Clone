import React, { useState, useContext, useEffect } from "react";
import { GlobalState } from "../../GlobalState";
import { Menu, Clear, ContactSupportOutlined } from "@material-ui/icons";
import "./Header.css";
import { Link } from "react-router-dom";
import { ArrowDropDown } from "@material-ui/icons";
import axios from "axios";
import UserLink from "../UserLink/UserLink";


window.onscroll = () => {
  OnScroll();
};

function OnScroll() {
  // if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
  //   document.getElementById("Header").style.backgroundColor = "black";
  // } else {
  //   document.getElementById("Header").style.backgroundColor = "transparent";
  // }
  // if (
  //   document.body.scrollTop > 1000 ||
  //   document.documentElement.scrollTop > 1000
  // ) {
  //   document.getElementById("Header").style.display = "none";
  // } else {
  //   document.getElementById("Header").style.display = "grid";
  // }
}

const Header = () => {
  const state = useContext(GlobalState);
  const [search, setSearch] = state.moviesAPI.search;
  const [userData] = state.usersAPI.userData;
  const [isLogged] = state.usersAPI.isLogged;
  const [isAdmin] = state.usersAPI.isAdmin;
  const [watchList] = state.usersAPI.watchList;
  const [toggleSearch, setToggleSearch] = useState(true);
  const [button, setButton] = useState(true);
  const [toggleMenu, setToggleMenu] = useState(true);

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

  window.addEventListener("resize", showButton);

  const logoutUser = async () => {
    await axios.get("/user/logout");
    localStorage.clear();
    window.location.href = "/";
  };


  // const adminRouter = () => {
  //   return (
  //     <>
  //       <li className="header_li">
  //         <Link className="header_Link" to="/genre">
  //           Genres
  //         </Link>
  //       </li>
  //       <li className="header_li">
  //         <Link className="header_Link" to="/create_movie">
  //           Create Movie
  //         </Link>
  //       </li>
  //     </>
  //   );
  // };

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
  return (
    <header id="Header">
      <div className="logo">
        <h1>
          <Link to="/">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png"
              alt="logo"
              className="header_logo"
            ></img>
          </Link>
        </h1>
      </div>
      <ul className={toggleMenu ? "header_ul" : "header_ul active"}>
        <li className="header_li">
          <Link className="header_Link" to="/movies">
            Movies
          </Link>
        </li>
        {!isAdmin && isLogged && (
          <li className="header_li">
            <Link className="header_Link" to="/favorite">
              Favorites
              {/* <span>{watchList.length}</span> */}
            </Link>
          </li>
        )}

        {/* không cần thiết, xử lí phần admin router ở sidebar */}
        {/* {isAdmin && adminRouter()} */}

        {/* <li>
          <div className="hd_menu">
            <Clear className="menu"></Clear>
          </div>
        </li> */}

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
      </div>
      {!button && (
        <div className="header_lastItem">
          {isLogged ? (
            loggedRouter()
          ) : (
            <li style={{ listStyle: "none" }}>
              <button className="login_btn">
                <Link className="header_Link" to="/login">
                  LOGIN
                </Link>
              </button>
            </li>
          )}
        </div>
      )}
      {button &&
        (toggleMenu ? (
          <div className="header_lastItem">
            <Menu onClick={() => setToggleMenu(false)} className="Menu"></Menu>
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
  );
};

export default Header;
