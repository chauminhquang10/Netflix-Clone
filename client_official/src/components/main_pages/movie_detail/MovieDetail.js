import React, { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import "./MovieDetail.css";
import MovieItem from "../movies/MovieItem";

const MovieDetail = () => {
  const params = useParams();
  const state = useContext(GlobalState);
  const [movies] = state.moviesAPI.movies;
  const [movieDetail, setMovieDetail] = useState([]);
  const addToWatchList = state.usersAPI.addToWatchList;
  useEffect(() => {
    if (params.id) {
      movies.forEach((movie) => {
        if (movie._id === params.id) setMovieDetail(movie);
      });
    }
  }, [params.id, movies]);

  // tránh trường hợp chưa có dữ liệu mà render thì văng lỗi
  if (movieDetail.length === 0) return null;

  return (
    <>
      <div className="detail">
        <img src={movieDetail.img.url} alt=""></img>
        <div className="box_detail">
          <div className="row">
            <h2>{movieDetail.title}</h2>
            <h6>#id: {movieDetail._id}</h6>
          </div>
          <span>year: {movieDetail.year}</span>
          <p>{movieDetail.desc}</p>
          <p>{movieDetail.duration}p</p>
          <p>{movieDetail.limitAge}+</p>
          <Link
            to="/favorite"
            className="watchlist"
            onClick={() => addToWatchList(movieDetail)}
          >
            Add to Watchlist
          </Link>
        </div>
      </div>

      <div>
        <h2>Related movies</h2>
        <div className="movies">
          {movies.map((movie) => {
            return movie.genre === movieDetail.genre &&
              movie._id !== movieDetail._id ? (
              <MovieItem key={movie._id} movie={movie}></MovieItem>
            ) : null;
          })}
        </div>
      </div>
    </>
  );
};

export default MovieDetail;
