import React, { useEffect, useState, useRef } from "react";
import "./ListItem.scss";
import { Link } from "react-router-dom";

const ListItem = ({ SetMovie, movie, MoveOut }) => {
  const inputRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
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
        <img src={movie.img} alt="list-item-img"></img>
      </div>
    </Link>
  );
};

export default ListItem;
