import React, { useContext } from "react";
import { Switch, Route } from "react-router-dom";
import Movies from "./movies/Movies";
import Favorite from "./favorite/Favorite";
import Login from "./auth/Login";
import Register from "./auth/Register";
import NotFound from "./utils/notfound/NotFound";
import MovieDetail from "./movie_detail/MovieDetail";
import Genres from "./genres/Genres";
import CreateMovie from "./create_movie/CreateMovie";
import ActivationEmail from "./auth/ActivationEmail";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import Profile from "./profile/Profile";
import EditUser from "./profile/EditUser";
import { GlobalState } from "../../GlobalState";

const Pages = () => {
  const state = useContext(GlobalState);
  const [isLogged] = state.usersAPI.isLogged;
  const [isAdmin] = state.usersAPI.isAdmin;

  return (
    <Switch>
      <Route path="/" exact component={Movies} />
      <Route path="/detail/:id" component={MovieDetail} />

      <Route path="/login" component={isLogged ? NotFound : Login} />
      <Route path="/register" component={isLogged ? NotFound : Register} />
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

      <Route path="/profile" component={isLogged ? Profile : NotFound} />
      <Route path="/edit_user/:id" component={isAdmin ? EditUser : NotFound} />

      <Route path="/genre" component={isAdmin ? Genres : NotFound} />

      <Route
        path="/create_movie"
        component={isAdmin ? CreateMovie : NotFound}
      />
      <Route
        path="/edit_movie/:id"
        component={isAdmin ? CreateMovie : NotFound}
      />

      <Route path="/favorite" component={Favorite} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
};

export default Pages;
