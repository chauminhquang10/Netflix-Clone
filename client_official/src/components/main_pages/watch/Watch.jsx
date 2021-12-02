import { ArrowBackOutlined } from "@material-ui/icons";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Watch.scss";

const Watch = () => {
  const location = useLocation();
  const movie = location.movie;
  return (
    <div className="watch">
      <Link to="/">
        <div className="back">
          <ArrowBackOutlined />
          Home
        </div>
      </Link>
      <video
        className="video"
        autoPlay
        progress
        controls
        src="https://drive.google.com/file/d/1rLAhlRYuwUloF9FdcKU5v-E8MJYyfaME/preview"
      />
    </div>
  );
};

export default Watch;
