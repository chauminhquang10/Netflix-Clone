import "./MovieList.scss";

import { Link } from "react-router-dom";

import Button from "../../button/Button";

import ListItem from "../main/list/listItem/ListItem";
import ListItemPopUp from "../main/list/listItem/ListItemPopUp";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, Controller, Thumbs } from "swiper";
import "swiper/swiper-bundle.css";

SwiperCore.use([Navigation, Pagination]);

const MovieList = ({ movies, movieDetail }) => {
  //////LIST ITEM/////////////////
  const [movie, setMovie] = useState(null);
  const [popup2, setPopup2] = useState(false);
  const [popupAble, setPopupAble] = useState(true);
  const [hoverLeft, setHoverLeft] = useState(0);

  const handleChangeMovie = (movie, left) => {
    if (popupAble) {
      setMovie(movie);
      setHoverLeft(left);
      setPopupAble(false);
      toggleIdle();
    }
  };

  const togglePopup2 = (value) => {
    setTimeout(() => {
      value && !popupAble && setPopup2(value);
      if (!value) {
        togglePopupAble2();
        setPopup2(value);
      }
      console.log("set p2 " + value);
    }, 100);
  };

  const togglePopupAble = (value) => {
    setTimeout(() => {
      if (value) {
        setPopupAble(value);
        setMovie(null);
        setPopup2(false);
      }
      if (!value) {
        setPopupAble(value);
      }
      console.log("p2 is " + popup2);
    }, 100);
  };

  const togglePopupAble2 = () => {
    setTimeout(() => {
      if (!popupAble) togglePopupAble(true);
      console.log("p is " + popupAble);
    }, 1000);
  };

  const toggleIdle = () => {
    setTimeout(() => {
      if (!popup2) togglePopupAble();
      console.log("p2 is idle " + popup2);
    }, 1000);
  };
  //////LIST ITEM/////////////////
  return (
    <div className="movie_detail_list">
      <div style={{ position: "relative" }}>
        <Swiper
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
                <ListItem SetMovie={handleChangeMovie} movie={movie}></ListItem>
              </SwiperSlide>
            ) : null;
          })}
        </Swiper>
      </div>
      <ListItemPopUp
        movie={movie}
        SetTrigger={togglePopup2}
        left={hoverLeft + 4}
      />
    </div>
  );
};

export default MovieList;
