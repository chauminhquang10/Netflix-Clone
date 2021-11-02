import {
  ArrowBackIosOutlined,
  ArrowForwardIosOutlined,
} from "@material-ui/icons";
import "./List.scss";
import React, { useContext, useState, useRef } from "react";
import { GlobalState } from "../../../../GlobalState";
import MovieItem from "../MovieItem";
import axios from "axios";
import ListItem from "./listItem/ListItem";

const List = ({ title, genre }) => {
  const listRef = useRef();
  const state = useContext(GlobalState);
  const [movies, setMovies] = state.moviesAPI.movies;
  const [slideNumber, setSlideNumber] = useState(0);

  const handleClick = (direction) => {
    let distance = listRef.current.getBoundingClientRect().x - 50;
    if (direction === "left" && slideNumber > 0) {
      setSlideNumber(slideNumber - 1);
      listRef.current.style.transform = `translateX(${230 + distance}px)`;
    } else if (direction === "right" && slideNumber < 4) {
      setSlideNumber(slideNumber + 1);
      listRef.current.style.transform = `translateX(${-230 + distance}px)`;
    }
  };

  return (
    <div className="list">
      <span className="listTitle">{title}</span>
      <div className="wrapper">
        <ArrowBackIosOutlined
          className="sliderArrow left"
          onClick={() => handleClick("left")}
          style={{ display: slideNumber === 0 && "none" }}
        ></ArrowBackIosOutlined>
        <div className="container" ref={listRef}>
          {movies.map(
            (movie, index) =>
              movie.genre === genre && <MovieItem movie={movie}></MovieItem>
          )}
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
