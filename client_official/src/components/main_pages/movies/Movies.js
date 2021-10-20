import React, { useContext } from "react";
import { GlobalState } from "../../../GlobalState";
import MovieItem from "./MovieItem";
import "./Movies.css";

const Movies = () => {
  const state = useContext(GlobalState);
  const [movies] = state.moviesAPI.movies;

  return (
    <div className="movies">
      {movies.map((movie) => {
        return <MovieItem key={movie._id} movie={movie}></MovieItem>;
      })}
    </div>
  );
};

export default Movies;
