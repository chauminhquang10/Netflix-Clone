import React from "react";
import { Link } from "react-router-dom";

const CastList = ({ actors }) => {
  return (
    <div className="casts">
      {actors.map((cast, index) => (
        <Link to={`/person/${cast._id}`}>
          <div key={index} className="casts__item">
            <div
              className="casts__item__img"
              style={{ backgroundImage: `url(${cast.image})` }}
            ></div>
            <p className="casts__item__name">{cast.name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CastList;
