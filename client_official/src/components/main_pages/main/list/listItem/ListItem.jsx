import {
  Add,
  PlayArrow,
  ThumbDownAltOutlined,
  ThumbUpAltOutlined,
} from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import "./ListItem.scss";
import { Link } from "react-router-dom";

const ListItem = ({ index, movie }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link to={{ pathname: "/watch", movie }}>
      <div
        className="listItem"
        style={{ left: isHovered && index * 225 - 50 + index * 2.5 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img src={movie.img.url} alt="list-item-img"></img>
        {isHovered && (
          <>
            <video src={movie.trailer} autoPlay={true} loop />
            <div className="itemInfo">
              <div className="icons">
                <PlayArrow className="icon"></PlayArrow>
                <Add className="icon"></Add>
                <ThumbUpAltOutlined className="icon"></ThumbUpAltOutlined>
                <ThumbDownAltOutlined className="icon"></ThumbDownAltOutlined>
              </div>
              <div className="itemInfoTop">
                <span>{movie.duration}</span>
                <span className="limit">+{movie.limit}</span>
                <span>{movie.year}</span>
              </div>
              <div className="desc">{movie.desc}</div>
              <div className="genre">{movie.genre}</div>
            </div>
          </>
        )}
      </div>
    </Link>
  );
};

export default ListItem;
