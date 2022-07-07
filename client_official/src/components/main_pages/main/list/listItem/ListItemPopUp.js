import { Add, PlayArrow, ThumbUpAltOutlined } from "@material-ui/icons";
import CheckIcon from "@mui/icons-material/Check";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import React, { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { GlobalState } from "../../../../../GlobalState";
import axios from "axios";
import "./ListItemPopUp.scss";

const ListItemPopUp = ({ movie, top, left, SetTrigger }) => {
  const state = useContext(GlobalState);
  const [watchList, setWatchList] = state.usersAPI.watchList;
  const [isAddedToWatchList, setIsAddedToWatchList] = useState(false);
  const [token] = state.token;
  const addToWatchList = state.usersAPI.addToWatchList;
  const PopupRef = useRef();

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

  const handlePosition = () => {
    left = left - 100;
    if (left < 0) left = 0;
    if (left > 1111) left = 1111;
    PopupRef.current.style.left = `${left}px`;
  };

  useEffect(() => {
    if (left) {
      handlePosition();
    }
  }, [left]);

  return (
    <div
      className={movie ? "div_Hovered" : "not_Hovered"}
      onMouseLeave={() => SetTrigger(false)}
      onMouseOver={() => SetTrigger(true)}
    >
      <div className="Popup" ref={PopupRef}>
        {movie && (
          <div>
            <Link to={`/detail/${movie._id}`}>
              <img
                className="Popup_img"
                src={movie.img.replace("original", "w300")}
                alt="list-item-img"
              ></img>
            </Link>
            <div className="itemInfo">
              <div className="icons">
                <PlayArrow className="icon"></PlayArrow>
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
                    <CheckIcon className="icon" />
                  )}
                </Link>
                {/* <ThumbUpAltOutlined className="icon"></ThumbUpAltOutlined> */}
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
                {/* <span className="limit">{movie.limitAge}+</span> */}
                <span className="limit">13+</span>
                <span>{movie.year}</span>
              </div>
              <div className="desc">{movie.desc}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListItemPopUp;
