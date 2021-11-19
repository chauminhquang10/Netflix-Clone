import React from "react";
import "./GridItem.css";
import { Link } from "react-router-dom";
const GridItem = ({ movie }) => {
  return (
    <Link to={`/detail/${movie._id}`}>
      <img className="Grid_Img" src={movie.img.url}></img>;
    </Link>
  );
};

export default GridItem;
