import {
  ArrowBackIosOutlined,
  ArrowForwardIosOutlined,
} from "@material-ui/icons";
import "./List.scss";
import React, { useContext, useState, useRef } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, Controller, Thumbs } from "swiper";
import "swiper/swiper-bundle.css";

import { OutlineButton } from "../../../button/Button";
import { Link } from "react-router-dom";
import ListItem from "./listItem/ListItem";
import ListItemPopUp from "./listItem/ListItemPopUp";

SwiperCore.use([Navigation, Pagination]);
const List = ({ title, movies, getTrigger, ToggleTrigger }) => {
  const [movie, setMovie] = useState(null);
  const [popup2, setPopup2] = useState(false);
  const [popupAble, setPopupAble] = useState(true);
  const [hoverLeft, setHoverLeft] = useState(0);

  const handleChangeMovie = (movie, left) => {
    if (getTrigger())
      if (popupAble) {
        setMovie(movie);
        setHoverLeft(left);
        setPopupAble(false);
        toggleIdle();
        ToggleTrigger(false);
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
        ToggleTrigger(true);
      }
      if (!value) {
        setPopupAble(value);
      }
      console.log("p2 is " + popup2);
    }, 100);
  };

  const togglePopupAble2 = () => {
    setTimeout(() => {
      togglePopupAble(true);
      console.log("p is " + popupAble);
    }, 500);
  };

  const toggleIdle = () => {
    setTimeout(() => {
      if (!popup2) togglePopupAble();
      console.log("p2 is idle " + popup2);
    }, 500);
  };

  return (
    <div className="list">
      <div className="list_header">
        <span className="listTitle">{title}</span>
        <Link to="/movies">
          <OutlineButton className="small">view more</OutlineButton>
        </Link>
      </div>
      <div style={{ position: "relative" }}>
        <Swiper
          style={{ overflow: "hidden" }}
          id="main"
          tag="section"
          wrapperTag="ul"
          navigation
          slidesPerView={6}
        >
          {movies.map((movie, index) => (
            <SwiperSlide style={{ listStyle: "none" }} key={index} tag="li">
              <ListItem SetMovie={handleChangeMovie} movie={movie}></ListItem>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <ListItemPopUp movie={movie} SetTrigger={togglePopup2} left={hoverLeft} />
    </div>
  );
};

export default List;
