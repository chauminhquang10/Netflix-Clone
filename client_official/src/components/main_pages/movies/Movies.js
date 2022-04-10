import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import MovieItem from "../main/MovieItem";
import Filter from "./Filter";
import Pagination from "./Pagination";
import "./Movies.css";
import PuffLoader from "react-spinners/PuffLoader";
import axios from "axios";
import Featured from "../main/Feature/Feature";

import SearchPage from "../main/search_page/SearchPage";

const Movies = () => {
  const state = useContext(GlobalState);
  const [movies, setMovies] = state.moviesAPI.movies;
  const [token] = state.token;
  const [isAdmin] = state.usersAPI.isAdmin;
  const [moviesCallback, setMoviesCallback] = state.moviesAPI.moviesCallback;
  const [loading, setLoading] = useState(false);

  //xử lí delete all
  const [isChecked, setIsChecked] = useState(false);

  // phân trang trên front end
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage, setMoviesPerPage] = useState(30);

  // index của last Movie tuy là 10 , 20 ,... nhưng hàm slice nó k lấy (nó chỉ lấy 9,19,....)
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
  const [genre, setGenre] = state.moviesAPI.genre;
  const [genres] = state.genresAPI.genres;
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

  if (loading) {
    return (
      <div className="loading">
        <PuffLoader color={"#36D7B7"} loading={true} size={60} />
      </div>
    );
  }
  const handleGenre = (e) => {
    setGenre(e.target.value);
  };
  return (
    <>
      <div className="movies_container">
        <div>
          <div className="Sort_container">
            <div className="Sort_child">
              <span>Genre:</span>
              <select name="genre" id="genre" onChange={handleGenre}>
                <option value="">All</option>
                {genres.map((genre) => (
                  <option
                    className="option"
                    value={"genre=" + genre._id}
                    key={genre._id}
                  >
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="related_titles_container">
          <div className="related_titles">Related Titles :</div>
          <div className="related_titles_content">
            {currentMovies.map((movie, index) => {
              if (index > currentMovies.length - 1 || index > 10) {
                return;
              } else if (index == currentMovies.length - 1 || index == 10) {
                return (
                  <div className="related_titles_content_child_container">
                    <div className="related_titles_content_child">
                      &nbsp; {movie.title}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="related_titles_content_child_container">
                    <div className="related_titles_content_child">
                      &nbsp; {movie.title} &nbsp;
                    </div>
                    <p className="related_titles_content_child_p">|</p>
                  </div>
                );
              }
            })}
          </div>
        </div>
        <div className="movies">
          {currentMovies.map((movie) => {
            return (
              <MovieItem
                key={movie._id}
                movie={movie}
                isAdmin={isAdmin}
              ></MovieItem>
            );
          })}
        </div>
        <div className="Pagination">
          <div className="Pagination1">
            <Pagination
              moviesPerPage={moviesPerPage}
              totalMovies={movies.length}
              paginate={paginate}
            ></Pagination>
          </div>
        </div>
        {movies.length === 0 && (
          <div className="loading">
            <PuffLoader color={"#36D7B7"} loading={true} size={60} />
          </div>
        )}
      </div>
    </>
  );
};

export default Movies;
