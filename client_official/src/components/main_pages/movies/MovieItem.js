import React from "react";
import { Link } from "react-router-dom";
import "./MovieItem.css";

//custom thêm (chưa hiển thị hết thông tin phim, có thể hiển thị cụ thể trong detail movie cũng dc)
const MovieItem = ({ movie }) => {
  return (
    <div className="movie_card">
      <img src={movie.img.url} alt=""></img>
      <div className="movie_box">
        <h2 title={movie.title}>{movie.title}</h2>
        <span>Year: {movie.year}</span>
        <p>{movie.desc}</p>
      </div>
      <div className="row_btn">
        <Link id="btn_favorite" to="#!">
          Watch Later
        </Link>
        <Link id="btn_view" to={`/detail/${movie._id}`}>
          Detail
        </Link>
      </div>
    </div>
  );
};

export default MovieItem;
