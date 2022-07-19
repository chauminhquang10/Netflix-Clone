import React from "react";
import "./WidgetSmall.scss";
import { Visibility } from "@material-ui/icons";
import { Link } from "react-router-dom";

const MovieStrat = ({ movies }) => {
  return (
    <div className="movieSmall">
      <span className="movieSmallTitle">Movie Ranking</span>
      <ul className="movieSmallList">
        <li className="movieSmallListItem">
          <div className="movieSmallUser">
            <span className="movieSmallUsername">poster</span>
          </div>
          <div className="movieSmallUser">
            <span className="movieSmallUsername">title</span>
          </div>
          <div className="movieSmallUser">
            <span className="movieSmallUsername">views</span>
          </div>
          <div className="movieSmallUser">
            <span className="movieSmallUsername"></span>
          </div>
        </li>
        {movies.map((item) => (
          <li className="movieSmallListItem">
            <img
              src={
                item.imgSmall ||
                "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
              }
              className="movieSmallImg"
            ></img>
            <div className="movieSmallUser">
              <span className="movieSmallUsername">{item.title}</span>
            </div>
            <div className="movieSmallUser">
              <span className="movieSmallUsername">{item.views}</span>
            </div>
            <Link to={`/edit_movie/${item._id}`}>
              <button className="movieSmallButton">
                <Visibility className="movieSmallIcon"></Visibility>
                Display
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieStrat;
