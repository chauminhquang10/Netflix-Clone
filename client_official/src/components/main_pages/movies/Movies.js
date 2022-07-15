import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import MovieItem from "../main/MovieItem";
import Pagination from "./Pagination";
import "./Movies.css";
import PuffLoader from "react-spinners/PuffLoader";
import Featured from "../main/Feature/Feature";

const Movies = () => {
  const state = useContext(GlobalState);
  const [movies, setMovies] = state.moviesAPI.movies;
  const [loading, setLoading] = useState(false);

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

  if (loading) {
    return (
      <div className="loading">
        <PuffLoader color={"#36D7B7"} loading={true} size={60} />
      </div>
    );
  }

  return (
    <div className="Movies-container">
      <Featured
        watch="/watch/335983/62d1434e0adaae26c057488b"
        type="movies"
        bigImg="https://images3.alphacoders.com/948/thumb-1920-948864.jpg"
        smallImg="https://www.themoviedb.org/t/p/w600_and_h900_bestv2/2uNW4WbgBXL25BAbXGLnLqX71Sw.jpg"
        desc="Investigative journalist Eddie Brock attempts a comeback following a scandal, but accidentally becomes the host of Venom, a violent, super powerful alien symbiote. Soon, he must rely on his newfound powers to protect the world from a shadowy organization looking for a symbiote of their own."
        titleImg="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/dddb8beb-7509-4c66-bc59-5e64fc25d614/dc2kdbo-23cebbbb-db46-488b-9729-9e968f06bec0.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2RkZGI4YmViLTc1MDktNGM2Ni1iYzU5LTVlNjRmYzI1ZDYxNFwvZGMya2Riby0yM2NlYmJiYi1kYjQ2LTQ4OGItOTcyOS05ZTk2OGYwNmJlYzAucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.NqsS3kJf8LM6kJapuvOrZ6oow-m9jmGo4D12Ou1KLLQ"
        trailer="https://www.youtube.com/embed/u9Mv98Gr5pY"
      />
      <div className="movies">
        {currentMovies.map((movie) => {
          return <MovieItem key={movie._id} movie={movie}></MovieItem>;
        })}
      </div>
      <div className="Pagination">
        <Pagination
          moviesPerPage={moviesPerPage}
          totalMovies={movies.length}
          paginate={paginate}
        ></Pagination>
      </div>
      {movies.length === 0 && (
        <div className="loading">
          <PuffLoader color={"#36D7B7"} loading={true} size={60} />
        </div>
      )}
    </div>
  );
};

export default Movies;
