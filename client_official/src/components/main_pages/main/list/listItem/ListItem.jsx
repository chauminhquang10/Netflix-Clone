import React, { useEffect, useState, useRef } from "react";
import "./ListItem.scss";
import { Link } from "react-router-dom";

const ListItem = ({ SetMovie, movie, MoveOut }) => {
  const inputRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  // const scrollHandler = (_) => {
  //   console.log(inputRef.current.getBoundingClientRect().left);
  // };
  // useEffect(() => {
  //   window.addEventListener("scroll", scrollHandler, true);
  //   return () => {
  //     window.removeEventListener("scroll", scrollHandler, true);
  //   };
  // }, []);
  return (
    <Link to={{ pathname: "", movie }}>
      <div
        className="listItem"
        onMouseOver={() =>
          SetMovie(
            movie,
            inputRef.current.getBoundingClientRect().left,
            inputRef.current.getBoundingClientRect().top
          )
        }
        ref={inputRef}
      >
        <img src={movie.img.url} alt="list-item-img"></img>
        <>
          {/* <div className="Popup">
            <Link to={`/detail/${movie._id}`}>
              <img
                className="Popup_img"
                src={movie.img.url}
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
                    <DeleteForeverIcon className="icon" />
                  )}
                </Link>
                <ThumbUpAltOutlined className="icon"></ThumbUpAltOutlined>
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
          </div> */}
        </>
      </div>
    </Link>
  );
};

export default ListItem;
