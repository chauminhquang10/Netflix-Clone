import React from "react";
import "./WidgetSmall.scss";
import { Visibility } from "@material-ui/icons";
import { Link } from "react-router-dom";

const GenreStrat = ({ genres }) => {
  return (
    <div className="movieSmall">
      <span className="movieSmallTitle">Genre Ranking</span>
      <ul className="movieSmallList">
        <li className="movieSmallListItem2">
          <div className="movieSmallUser">
            <span className="movieSmallUsername">name</span>
          </div>
          <div className="movieSmallUser">
            <span className="movieSmallUsername">views</span>
          </div>
        </li>
        {genres.map((item) => (
          <li className="movieSmallListItem2">
            <div className="movieSmallUser">
              <span className="movieSmallUsername">{item.name}</span>
            </div>
            <div className="movieSmallUser">
              <span className="movieSmallUsername">{item.views}</span>
            </div>
            <Link to={`/genres`}>
              <button className="movieSmallButton">
                <Visibility className="movieSmallIcon"></Visibility>
                Edit
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GenreStrat;
