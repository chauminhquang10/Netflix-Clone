import React from "react";
import "./GridItem.css";
import { Link } from "react-router-dom";
const GridItem = ({ movie, isBig }) => {
  return (
    <div className="Grid_item_container">
      <Link to={`/detail/${movie._id}`}>
        <img
          alt=""
          className="Grid_item_img"
          src={isBig ? movie.img : movie.img.replace("original", "w300")}
        ></img>
      </Link>
    </div>
  );
};

export default GridItem;
