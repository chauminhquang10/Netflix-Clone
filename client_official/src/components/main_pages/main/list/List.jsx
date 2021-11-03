import {
  ArrowBackIosOutlined,
  ArrowForwardIosOutlined,
} from "@material-ui/icons";
import "./List.scss";
import React, { useContext, useState, useRef } from "react";
import MovieItem from "../MovieItem";
import ListItem from "./listItem/ListItem";
import { SwiperSlide, Swiper } from "swiper/react";
import { OutlineButton } from "../../../button/Button";
import { Link } from "react-router-dom";

const List = ({ title, movies }) => {
  const listRef = useRef();
  const [slideNumber, setSlideNumber] = useState(0);

  const handleClick = (direction) => {
    let distance = listRef.current.getBoundingClientRect().x - 50;
    if (direction === "left" && slideNumber > 0) {
      if (direction === "left" && slideNumber == 1) {
        setSlideNumber(slideNumber - 1);
        listRef.current.style.transform = `translateX(${340 + distance}px)`;
      } else {
        setSlideNumber(slideNumber - 1);
        listRef.current.style.transform = `translateX(${290 + distance}px)`;
      }
    } else if (direction === "right" && slideNumber < 3) {
      if (direction === "right" && slideNumber == 0) {
        setSlideNumber(slideNumber + 1);
        listRef.current.style.transform = `translateX(${-340 + distance}px)`;
      } else {
        setSlideNumber(slideNumber + 1);
        listRef.current.style.transform = `translateX(${-290 + distance}px)`;
      }
    }
  };

  return (
    <div className="list">
      <div className="list_header">
        <span className="listTitle">{title}</span>
        <Link to="/movies">
          <OutlineButton className="small">view more</OutlineButton>
        </Link>
      </div>
      <div className="wrapper">
        <ArrowBackIosOutlined
          className="sliderArrow left"
          onClick={() => handleClick("left")}
          style={{ display: slideNumber === 0 && "none" }}
        ></ArrowBackIosOutlined>
        <div className="list_container" ref={listRef}>
          {movies.map((movie, index) => (
            <MovieItem movie={movie}></MovieItem>
          ))}
        </div>
        <ArrowForwardIosOutlined
          className="sliderArrow right"
          onClick={() => handleClick("right")}
        ></ArrowForwardIosOutlined>
      </div>
    </div>
  );
};

export default List;
