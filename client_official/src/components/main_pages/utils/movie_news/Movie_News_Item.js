import React from "react";
import "./Movie_News_Item.scss";

const Movie_News_Item = () => {
  return (
    <div className="Movie_News_Item_container">
      <img
        className="Movie_News_Item_img"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0NvmXqKsBY68oW_4lvg7bh7f8ZsblbwFlCw&usqp=CAU"
      />
      <div className="Movie_News_Item_info">
        <div className="Movie_News_Item_info_title">
          New Content !!<br></br>HAHA
        </div>
        <div className="Movie_News_Item_info_time">2h20min ago</div>
      </div>
    </div>
  );
};

export default Movie_News_Item;
