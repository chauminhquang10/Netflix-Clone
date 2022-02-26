import React from "react";
import "./Movie_News_List.scss";
import Movie_News_Item from "./Movie_News_Item";

const Movie_News_List = () => {
  return (
    <div className="Movie_News_List">
      <div className="Movie_News_List_container">
        <Movie_News_Item />
        <Movie_News_Item />
        <Movie_News_Item />
        <Movie_News_Item />
        <Movie_News_Item />
      </div>
    </div>
  );
};

export default Movie_News_List;
