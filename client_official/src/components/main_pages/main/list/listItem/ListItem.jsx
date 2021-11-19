import { Add, PlayArrow, ThumbUpAltOutlined } from "@material-ui/icons";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import React, { useContext, useState } from "react";
import "./ListItem.scss";
import { Link } from "react-router-dom";
import { GlobalState } from "../../../../../GlobalState";
import axios from "axios";

const ListItem = ({ index, movie }) => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [isHovered, setIsHovered] = useState(false);
  const addToWatchList = state.usersAPI.addToWatchList;
  const [watchList, setWatchList] = state.usersAPI.watchList;
  const [toggleAddFVR, setToggleAddFVR] = useState(false);

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

  window.onmousemove = () => {
    watchList.forEach(checkToggleAddFVR);
  };

  function checkToggleAddFVR(item) {
    console.log(item._id, movie._id);
    if (movie._id === item._id) setToggleAddFVR(true);
  }

  return (
    <Link to={{ pathname: "/watch", movie }}>
      <div
        className="listItem"
        style={{ left: isHovered && index * 225 - 50 + index * 2.5 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img src={movie.img.url} alt="list-item-img"></img>
        <>
          <div className="Popup">
            <img
              className="Popup_img"
              src={movie.img.url}
              alt="list-item-img"
            ></img>
            <div className="itemInfo">
              <div className="icons">
                <PlayArrow className="icon"></PlayArrow>

                <Link
                  to="#!"
                  onClick={() => {
                    !toggleAddFVR
                      ? addToWatchList(movie)
                      : removeMovie(movie._id);
                  }}
                >
                  {!toggleAddFVR ? (
                    <Add className="icon"></Add>
                  ) : (
                    <DeleteForeverIcon className="icon" />
                  )}
                </Link>
                <ThumbUpAltOutlined className="icon"></ThumbUpAltOutlined>
                <Link to={`/detail/${movie._id}`}>
                  <DoubleArrowIcon className="icon"></DoubleArrowIcon>
                </Link>
              </div>
              <div className="itemInfoTop">
                <h4
                  style={{
                    fontWeight: "500",
                    fontSize: "13px",
                    color: "white",
                    textTransform: "capitalize",
                  }}
                >
                  {movie.title}
                </h4>
                <span className="limit">+{movie.limitAge}</span>
                <span>{movie.year}</span>
              </div>
              <div className="desc">{movie.desc}</div>
              {/* <div className="genre">{movie.genre}</div> */}
            </div>
          </div>
        </>
      </div>
    </Link>
  );
};

export default ListItem;
