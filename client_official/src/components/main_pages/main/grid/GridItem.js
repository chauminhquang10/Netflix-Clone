import React from "react";
import "./GridItem.css";
import { Link } from "react-router-dom";
const GridItem = ({ movie }) => {
  return (
    <div className="Grid_item_container">
      <Link to={`/detail/${movie._id}`}>
        <img className="Grid_item_img" src={movie.img.url}></img>
      </Link>
    </div>
  );
};

export default GridItem;
