import { Add, PlayArrow } from "@material-ui/icons";
import CheckIcon from "@mui/icons-material/Check";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GlobalState } from "../../../../../GlobalState";
import axios from "axios";
import "./HorizontalListLeftItem.scss";

const HorizontalListLeftItem = ({ movie }) => {
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
    <div className="HorizontalListLeftItem_container">
      <img
        className="HorizontalListLeftItem_img"
        src={movie.img.replace("original", "w300")}
        alt="list-item-img"
      ></img>
      <div className="HorizontalListLeftItem_itemInfo">
        <div className="HorizontalListLeftItem_icons">
          <Link
            className="detail_link"
            to={`/watch/${movie.TMDBid}/${movie._id}`}
          >
            <PlayArrow className="HorizontalListLeftItem_icon"></PlayArrow>
          </Link>
          <Link
            to="#!"
            onClick={() => {
              !isAddedToWatchList
                ? addToWatchList(movie)
                : removeMovie(movie._id);
            }}
          >
            {!isAddedToWatchList ? (
              <Add className="HorizontalListLeftItem_icon"></Add>
            ) : (
              <CheckIcon className="HorizontalListLeftItem_icon" />
            )}
          </Link>
          <Link to={`/detail/${movie._id}`}>
            <DoubleArrowIcon className="HorizontalListLeftItem_icon"></DoubleArrowIcon>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HorizontalListLeftItem;
