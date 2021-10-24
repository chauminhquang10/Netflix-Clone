import React from "react";
import "./MovieItem.css";
import Buttons from "./Buttons";

//custom thêm (chưa hiển thị hết thông tin phim, có thể hiển thị cụ thể trong detail movie cũng dc)
const MovieItem = ({ movie, isAdmin, deleteMovie, handleCheck }) => {
  return (
    <div className="movie_card">
      {isAdmin && (
        <input
          type="checkbox"
          checked={movie.checked}
          onChange={() => handleCheck(movie._id)}
        ></input>
      )}
      <img src={movie.img.url} alt=""></img>
      <div className="movie_box">
        <h2 title={movie.title}>{movie.title}</h2>
        <span>Year: {movie.year}</span>
        <p>{movie.desc}</p>
      </div>
      <Buttons movie={movie} deleteMovie={deleteMovie}></Buttons>
    </div>
  );
};

export default MovieItem;
