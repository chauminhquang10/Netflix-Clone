import React from "react";
import "./MovieItem.css";
import Buttons from "./Buttons";

//custom thêm (chưa hiển thị hết thông tin phim, có thể hiển thị cụ thể trong detail movie cũng dc)
const MovieItem = ({ movie, isAdmin, deleteMovie, handleCheck }) => {
  return (
    <div className="main_movie_card">
      <img src={movie.img.url} alt=""></img>
      <div className="main_movie_box">
        <h2 title={movie.title}>{movie.title}</h2>
        <span>Year: {movie.year}</span>
      </div>
    </div>
  );
};

export default MovieItem;
