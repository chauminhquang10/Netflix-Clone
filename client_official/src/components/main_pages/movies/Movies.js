import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import MovieItem from "../main/MovieItem";
import Filter from "./Filter";
import Pagination from "./Pagination";
import "./Movies.css";
import PuffLoader from "react-spinners/PuffLoader";
import axios from "axios";
import Featured from "../main/Feature/Feature";

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
  const [moviesPerPage, setMoviesPerPage] = useState(30);

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
      <Featured
        type="movies"
        bigImg="https://images3.alphacoders.com/948/thumb-1920-948864.jpg"
        smallImg="https://www.themoviedb.org/t/p/w600_and_h900_bestv2/2uNW4WbgBXL25BAbXGLnLqX71Sw.jpg"
        desc="Investigative journalist Eddie Brock attempts a comeback following a scandal, but accidentally becomes the host of Venom, a violent, super powerful alien symbiote. Soon, he must rely on his newfound powers to protect the world from a shadowy organization looking for a symbiote of their own."
        titleImg="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/dddb8beb-7509-4c66-bc59-5e64fc25d614/dc2kdbo-23cebbbb-db46-488b-9729-9e968f06bec0.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2RkZGI4YmViLTc1MDktNGM2Ni1iYzU5LTVlNjRmYzI1ZDYxNFwvZGMya2Riby0yM2NlYmJiYi1kYjQ2LTQ4OGItOTcyOS05ZTk2OGYwNmJlYzAucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.NqsS3kJf8LM6kJapuvOrZ6oow-m9jmGo4D12Ou1KLLQ"
        trailer="https://www.youtube.com/embed/u9Mv98Gr5pY"
      />
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
    </>
  );
};

export default Movies;
