import React, { useContext } from "react";
import { Switch, Route } from "react-router-dom";
import "./Pages.css";
import Main from "./main/Main";
import Movies from "./movies/Movies";
import Favorite from "./favorite/Favorite";
import Login from "./auth/Login";
import Register from "./auth/Register";
import NotFound from "./utils/notfound/NotFound";
import MovieDetail from "./movie_detail/MovieDetail";
import AdminGenres from "./genres/AdminGenres";
import AdminLists from "./lists/AdminLists";
import CreateMovie from "./create_movie/CreateMovie";
import ActivationEmail from "./auth/ActivationEmail";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import UserProfile from "./profile/UserProfile";
import Watch from "./watch/Watch";

import SideBar from "../Admin_resources/Admin_components/sidebar/SideBar";
import HomePage from "../Admin_resources/pages/homepage/HomePage";
import UserList from "../Admin_resources/pages/userList/UserList";
import EditUser from "../Admin_resources/pages/edit_user/EditUser";
import AdminMovieList from "../Admin_resources/pages/productList/MovieList";
import EditMovie from "../Admin_resources/pages/product/EditMovie";
import NewMovie from "../Admin_resources/pages/newproduct/NewMovie";
import { GlobalState } from "../../GlobalState";

import AdminProfile from "../Admin_resources/pages/profile/AdminProfile";

const Pages = () => {
  const state = useContext(GlobalState);
  const [isLogged] = state.usersAPI.isLogged;
  const [isAdmin] = state.usersAPI.isAdmin;

  return (
    <>
      {isAdmin ? (
        <div className="admin-container">
          <SideBar></SideBar>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route
              exact
              path="/users"
              component={isAdmin ? UserList : NotFound}
            />

            <Route
              path="/edit_user/:id"
              component={isAdmin ? EditUser : NotFound}
            />

            {/* Movie List */}
            <Route
              exact
              path="/movies"
              component={isAdmin ? AdminMovieList : NotFound}
            ></Route>

            {/* Edit phim */}

            <Route
              path="/edit_movie/:id"
              component={isAdmin ? EditMovie : NotFound}
            />

            {/* Tạo phim */}
            <Route path="/newMovie" component={isAdmin ? NewMovie : NotFound} />

            <Route
              path="/profile"
              component={isLogged ? AdminProfile : NotFound}
            />

            {/* Thể loại */}
            <Route
              path="/genres"
              component={isAdmin ? AdminGenres : NotFound}
            />

            {/* List */}
            <Route path="/lists" component={isAdmin ? AdminLists : NotFound} />

            <Route path="*" component={NotFound} />
          </Switch>
        </div>
      ) : (
        <>
          <Switch>
            <Route path="/" exact component={Main} />
            <Route path="/movies" exact component={Movies} />
            <Route path="/detail/:id" component={MovieDetail} />
            <Route path="/favorite" component={Favorite} />
            <Route path="/watch" component={Watch} />

            <Route path="/login" component={isLogged ? NotFound : Login} />
            <Route
              path="/register"
              component={isLogged ? NotFound : Register}
            />
            <Route
              path="/user/activate/:activation_token"
              component={ActivationEmail}
            />
            <Route
              path="/forgot_password"
              component={isLogged ? NotFound : ForgotPassword}
            />
            <Route
              path="/user/reset/:access_token"
              component={isLogged ? NotFound : ResetPassword}
            />
            <Route
              path="/profile"
              component={isLogged ? UserProfile : NotFound}
            />
            <Route path="*" component={NotFound} />
          </Switch>
        </>
      )}
    </>
  );
};

export default Pages;
