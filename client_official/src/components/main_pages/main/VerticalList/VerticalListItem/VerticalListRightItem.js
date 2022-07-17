import React, { useContext, useState, useEffect } from "react";
import { GlobalState } from "../../../../../GlobalState";
import axios from "axios";
import "./VerticalListRightItem.scss";

const VerticalListRightItem = ({ movie }) => {
  const state = useContext(GlobalState);
  const [watchList, setWatchList] = state.usersAPI.watchList;
  const [isAddedToWatchList, setIsAddedToWatchList] = useState(false);
  const [token] = state.token;

  useEffect(() => {
    if (movie) {
      watchList.forEach((item) => {
        if (item._id === movie._id) {
          setIsAddedToWatchList(true);
        }
      });
    }
  }, [movie, watchList]);

  return (
    <div className="VerticalListRightItem_container">
      <img
        className="VerticalListRightItem_img"
        src={movie.img.replace("original", "w300")}
        alt="list-item-img"
      ></img>
      <div className="VerticalListRightItem_itemInfoTop">
        <span
          style={{
            fontWeight: "500",
            fontSize: "40px",
            color: "white",
            textTransform: "capitalize",
          }}
        >
          {movie.title}
        </span>
        <span className="VerticalListRightItem_limit">13+</span>
        <span>{movie.year}</span>
      </div>
      <div className="VerticalListRightItem_desc">{movie.desc}</div>
    </div>
  );
};

export default VerticalListRightItem;
