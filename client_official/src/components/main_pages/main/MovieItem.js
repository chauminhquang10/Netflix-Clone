import { Add, PlayArrow } from "@material-ui/icons";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import React, { useContext, useState, useEffect, useRef } from "react";
import "./MovieItem.scss";
import { Link } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";

const ListItem = ({ index, movie }) => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [isHovered, setIsHovered] = useState(false);
  const addToWatchList = state.usersAPI.addToWatchList;
  const [watchList, setWatchList] = state.usersAPI.watchList;
  const [isAddedToWatchList, setIsAddedToWatchList] = useState(false);
  const PopupRef = useRef();

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
    <Link to={{ pathname: "#", movie }}>
      <div
        className="listItem"
        style={{ left: isHovered && index * 225 - 50 + index * 2.5 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={movie.img.replace("original", "w300")}
          alt="list-item-img"
        ></img>
        <>
          <div className="Popup" ref={PopupRef}>
            <img
              className="Popup_img"
              src={movie.img.replace("original", "w300")}
              alt="list-item-img"
            ></img>
            <div className="itemInfo">
              <div className="icons">
                <Link
                  className="detail_link"
                  to={`/watch/${movie.TMDBid}/${movie._id}`}
                >
                  <PlayArrow className="icon"></PlayArrow>
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
                    <Add className="icon"></Add>
                  ) : (
                    <DeleteForeverIcon className="icon" />
                  )}
                </Link>
                <Link to={`/detail/${movie._id}`}>
                  <DoubleArrowIcon className="icon"></DoubleArrowIcon>
                </Link>
              </div>
              <div className="itemInfoTop">
                <span
                  style={{
                    fontWeight: "500",
                    fontSize: "13px",
                    color: "white",
                    textTransform: "capitalize",
                  }}
                >
                  {movie.title}
                </span>
                <span className="limit">+{movie.limitAge}</span>
                <span>{movie.year}</span>
              </div>
              <div className="desc">{movie.desc}</div>
            </div>
          </div>
        </>
      </div>
    </Link>
  );
};

export default ListItem;
