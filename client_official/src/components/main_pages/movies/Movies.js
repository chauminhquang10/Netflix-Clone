import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import MovieItem from "./MovieItem";
import Filter from "./Filter";
import Pagination from "./Pagination";
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
  const [lists, setLists] = state.listsAPI.lists;

  //xử lí delete all
  const [isChecked, setIsChecked] = useState(false);

  // phân trang trên front end
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage, setMoviesPerPage] = useState(20);

  // index của last Movie tuy là 10 , 20 ,... nhưng hàm slice nó k lấy (nó chỉ lấy 9,19,....)
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  //Chuyển trang
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
        {currentMovies.map((movie) => {
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

      <Pagination
        moviesPerPage={moviesPerPage}
        totalMovies={movies.length}
        paginate={paginate}
      ></Pagination>

      {movies.length === 0 && (
        <div className="loading">
          <PuffLoader color={"#36D7B7"} loading={true} size={60} />
        </div>
      )}
    </>
  );
};

export default Movies;
