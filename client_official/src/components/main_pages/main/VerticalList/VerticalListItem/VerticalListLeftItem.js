import { Add, PlayArrow, ThumbUpAltOutlined } from "@material-ui/icons";
import CheckIcon from "@mui/icons-material/Check";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import React, { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { GlobalState } from "../../../../../GlobalState";
import axios from "axios";
import "./VerticalListLeftItem.scss";

const VerticalListLeftItem = ({ movie }) => {
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
    <div className="VerticalListLeftItem_container">
      <img
        className="VerticalListLeftItem_img"
        src={movie.img.url}
        alt="list-item-img"
      ></img>
      <div className="VerticalListLeftItem_itemInfo">
        <div className="VerticalListLeftItem_icons">
          <PlayArrow className="VerticalListLeftItem_icon"></PlayArrow>
          <Link
            to="#!"
            onClick={() => {
              !isAddedToWatchList
                ? addToWatchList(movie)
                : removeMovie(movie._id);
            }}
          >
            {!isAddedToWatchList ? (
              <Add className="VerticalListLeftItem_icon"></Add>
            ) : (
              <CheckIcon className="VerticalListLeftItem_icon" />
            )}
          </Link>
          <Link to={`/detail/${movie._id}`}>
            <DoubleArrowIcon className="VerticalListLeftItem_icon"></DoubleArrowIcon>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerticalListLeftItem;
