import React from "react";
import "./MovieList.scss";

import { SwiperSlide, Swiper } from "swiper/react";
import { Link } from "react-router-dom";

import Button from "../../button/Button";

import MovieItem from "../movies/MovieItem";

const MovieList = ({ movies, movieDetail }) => {
  return (
    <div className="movie_detail_list">
      <Swiper grabCursor={true} spaceBetween={10} slidesPerView={"auto"}>
        {movies.map((movie, index) => {
          return movie.genre === movieDetail.genre &&
            movie._id !== movieDetail._id ? (
            <SwiperSlide key={index}>
              <MovieItem movie={movie}></MovieItem>
            </SwiperSlide>
          ) : null;
        })}
      </Swiper>
    </div>
  );
};

export default MovieList;
