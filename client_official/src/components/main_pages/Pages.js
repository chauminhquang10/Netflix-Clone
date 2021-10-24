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
