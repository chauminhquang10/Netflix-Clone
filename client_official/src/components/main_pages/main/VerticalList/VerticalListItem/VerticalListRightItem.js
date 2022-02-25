import { Add, PlayArrow, ThumbUpAltOutlined } from "@material-ui/icons";
import CheckIcon from "@mui/icons-material/Check";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import React, { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { GlobalState } from "../../../../../GlobalState";
import axios from "axios";
import "./VerticalListRightItem.scss";

const VerticalListRightItem = ({ movie }) => {
  const state = useContext(GlobalState);
  const [watchList, setWatchList] = state.usersAPI.watchList;
  const [isAddedToWatchList, setIsAddedToWatchList] = useState(false);
  const [token] = state.token;
  const addToWatchList = state.usersAPI.addToWatchList;

  useEffect(() => {
    if (movie) {
      watchList.forEach((item) => {
        if (item._id === movie._id) {
          setIsAddedToWatchList(true);
        }
      });
    }
  }, [movie, watchList]);

  const updateWatchList = async (watchList) => {
    await axios.patch(
      "/user/addwatchlist",
      { watchlist: watchList },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  };

  const removeMovie = (id) => {
    if (window.confirm("Do you want to remove this movie?")) {
      watchList.forEach((item, index) => {
        if (item._id === id) {
          watchList.splice(index, 1);
        }
      });
      setWatchList([...watchList]);
      updateWatchList(watchList);
    }
  };

  return (
    <div className="VerticalListRightItem_container">
      <img
        className="VerticalListRightItem_img"
        src={movie.img.url}
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
