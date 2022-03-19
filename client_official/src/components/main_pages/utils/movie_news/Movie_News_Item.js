import React from "react";
import "./Movie_News_Item.scss";
import moment from "moment";
import { Link } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import MoreVertIcon from "@mui/icons-material/MoreVert";
const Movie_News_Item = ({
  notify,
  handleIsRead,
  handleDeleteSingleNotify,
  isRead,
}) => {
  return (
    <div className="Movie_News_Item_container">
      <div
        className={
          isRead
            ? "Movie_News_Item_check_icon"
            : "Movie_News_Item_check_icon active"
        }
      >
        <FiberManualRecordIcon />
      </div>
      <div>
        <Link
          className="Movie_News_Item_Link"
          to={`${notify.url}`}
          onClick={() => handleIsRead(notify, notify.seenUsers)}
          style={{ textDecoration: "none" }}
        >
          <img className="Movie_News_Item_img" src={notify.image} />
        </Link>
      </div>
      <div>
        <Link
          className="Movie_News_Item_Link"
          to={`${notify.url}`}
          onClick={() => handleIsRead(notify, notify.seenUsers)}
          style={{ textDecoration: "none" }}
        >
          <div className="Movie_News_Item_info">
            <div className="Movie_News_Item_info_title">{notify.content}</div>
            <div className="Movie_News_Item_info_desc_container">
              <div className="Movie_News_Item_info_desc">{notify.text}</div>
            </div>
            <div className="Movie_News_Item_info_time">
              {moment(notify.createdAt).fromNow()}
            </div>
          </div>
        </Link>
      </div>
      <div className="Movie_News_Item_info_icon">
        <MoreVertIcon fontSize="large" />
        <div className="Movie_News_Item_info_icon_drop_list">
          <div
            className="Movie_News_Item_info_icon_drop_list_option"
            onClick={() => handleDeleteSingleNotify(notify)}
          >
            Delete
          </div>
          <div
            className="Movie_News_Item_info_icon_drop_list_option"
            onClick={() => handleIsRead(notify, notify.seenUsers)}
          >
            Mark As Read
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movie_News_Item;
