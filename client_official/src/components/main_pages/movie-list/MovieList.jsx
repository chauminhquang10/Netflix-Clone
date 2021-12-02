import "./MovieList.scss";

import { Link } from "react-router-dom";

import Button from "../../button/Button";

import ListItem from "../main/list/listItem/ListItem";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, Controller, Thumbs } from "swiper";
import "swiper/swiper-bundle.css";

SwiperCore.use([Navigation, Pagination]);

const MovieList = ({ movies, movieDetail }) => {
  return (
    <div className="movie_detail_list">
      <Swiper
        style={{ overflow: "visible" }}
        id="main"
        tag="section"
        wrapperTag="ul"
        navigation
        pagination
        spaceBetween={5}
        slidesPerView={5}
      >
        {movies.map((movie, index) => {
          return movie.genre === movieDetail.genre &&
            movie._id !== movieDetail._id ? (
            <SwiperSlide style={{ listStyle: "none" }} key={index} tag="li">
              <ListItem movie={movie}></ListItem>
            </SwiperSlide>
          ) : null;
        })}
      </Swiper>
    </div>
  );
};

export default MovieList;
