import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import MovieItem from "./MovieItem";
import Filter from "./Filter";
import LoadMore from "./LoadMore";
import "./Movies.css";
import PuffLoader from "react-spinners/PuffLoader";
import axios from "axios";

const Movies = () => {
  const state = useContext(GlobalState);
  const [movies, setMovies] = state.moviesAPI.movies;
  const [token] = state.token;
  const [isAdmin] = state.usersAPI.isAdmin;
  const [moviesCallback, setMoviesCallback] = state.moviesAPI.moviesCallback;
  const [loading, setLoading] = useState(false);
  //xử lí delete all
  const [isChecked, setIsChecked] = useState(false);

  const handleCheck = (id) => {
    movies.forEach((movie) => {
      if (movie._id === id) movie.checked = !movie.checked;
    });
    setMovies([...movies]);
  };

  const deleteMovie = async (id, public_id) => {
    try {
      setLoading(true);
      const deleteImg = axios.post(
        "/api/delete",
        { public_id },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const delMovie = axios.delete(`/api/movies/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      await deleteImg;
      await delMovie;
      setMoviesCallback(!moviesCallback);
      setLoading(false);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const checkAll = () => {
    movies.forEach((movie) => {
      movie.checked = !isChecked;
    });
    setMovies([...movies]);
    setIsChecked(!isChecked);
  };

  const deleteAll = () => {
    movies.forEach((movie) => {
      if (movie.checked) deleteMovie(movie._id, movie.img.public_id);
    });
    setIsChecked(false);
  };

  if (loading) {
    return (
      <div className="loading">
        <PuffLoader color={"#36D7B7"} loading={true} size={60} />
      </div>
    );
  }

  return (
    <>
      <Filter></Filter>
      {isAdmin && (
        <div className="delete-all">
          <span>Select All</span>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={checkAll}
          ></input>
          <button onClick={deleteAll}>Delete All</button>
        </div>
      )}

      <div className="movies">
        {movies.map((movie) => {
          return (
            <MovieItem
              key={movie._id}
              movie={movie}
              isAdmin={isAdmin}
              deleteMovie={deleteMovie}
              handleCheck={handleCheck}
            ></MovieItem>
          );
        })}
      </div>
      <LoadMore></LoadMore>
      {movies.length === 0 && (
        <div className="loading">
          <PuffLoader color={"#36D7B7"} loading={true} size={60} />
        </div>
      )}
    </>
  );
};

export default Movies;
