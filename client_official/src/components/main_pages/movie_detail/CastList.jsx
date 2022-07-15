import React from "react";
import { Link } from "react-router-dom";
import "./CastList.scss";

const CastList = ({ actors }) => {
  return (
    <div className="casts">
      {actors.map((cast, index) => (
        <Link to={`/person/${cast._id}`}>
          <div key={index} className="casts__item">
            <img
              alt=""
              className="casts__item__img"
              src={
                cast.image === "https://image.tmdb.org/t/p/original/null"
                  ? "https://res.cloudinary.com/minh-quang-21-kg/image/upload/v1655541960/movie/unknown_p0ax5n.jpg"
                  : cast.image
              }
            ></img>
            <p className="casts__item__name">{cast.name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CastList;
