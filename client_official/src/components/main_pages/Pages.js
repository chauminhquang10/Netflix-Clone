import React from "react";
import { Switch, Route } from "react-router-dom";
import Movies from "./movies/Movies";
import Favorite from "./favorite/Favorite";
import Login from "./auth/Login";
import Register from "./auth/Register";
import NotFound from "./utils/notfound/NotFound";
import MovieDetail from "./movie_detail/MovieDetail";

const Pages = () => {
  return (
    <Switch>
      <Route path="/" exact component={Movies} />
      <Route path="/detail/:id" component={MovieDetail} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/favorite" component={Favorite} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
};

export default Pages;
