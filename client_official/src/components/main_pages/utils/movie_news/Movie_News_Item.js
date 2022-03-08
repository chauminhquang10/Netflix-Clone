import React from "react";
import "./Movie_News_Item.scss";
import moment from "moment";
import { Link } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";
const Movie_News_Item = ({
  notify,
  handleIsRead,
  handleDeleteSingleNotify,
}) => {
  return (
    <div className="Movie_News_Item_container">
      <Link
        className="Movie_News_Item_Link"
        to={`${notify.url}`}
        onClick={() => handleIsRead(notify, notify.seenUsers)}
        style={{ textDecoration: "none" }}
      >
        <img className="Movie_News_Item_img" src={notify.image} />
      </Link>
      <Link
        className="Movie_News_Item_Link"
        to={`${notify.url}`}
        onClick={() => handleIsRead(notify, notify.seenUsers)}
        style={{ textDecoration: "none" }}
      >
        <div className="Movie_News_Item_info">
          <div className="Movie_News_Item_info_title">
            New Content !!!
            <br></br>
            {notify.content.slice(0, 20)}
          </div>
          <div className="Movie_News_Item_info_time">
            {moment(notify.createdAt).fromNow()}
          </div>
        </div>
      </Link>
      <div className="Movie_News_Item_info_icon">
        <CancelIcon
          fontSize="large"
          onClick={handleDeleteSingleNotify(notify)}
        />
      </div>
    </div>
  );
};

export default Movie_News_Item;
