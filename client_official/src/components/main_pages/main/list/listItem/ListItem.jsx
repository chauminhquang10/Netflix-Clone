import React, { useRef } from "react";
import "./ListItem.scss";
import { Link } from "react-router-dom";

const ListItem = ({ SetMovie, movie }) => {
  const inputRef = useRef(null);
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
        <img
          src={movie.img.replace("original", "w300")}
          alt="list-item-img"
        ></img>
      </div>
    </Link>
  );
};

export default ListItem;
