import React from "react";
import "./Movie_News_List.scss";
import MovieNewsItem from "./Movie_News_Item";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import MarkChatReadIcon from "@mui/icons-material/MarkChatRead";
import Button from "@mui/material/Button";
const Movie_News_List = ({
  notify,
  handleIsRead,
  handleDeleteSingleNotify,
  handleDeleteAll,
  UserData,
}) => {
  return (
    <div className="Movie_News_List">
      <div className="Movie_News_List_container">
        <div className="Movie_News_List_buttons">
          <Button
            variant="outlined"
            startIcon={<DeleteSweepIcon />}
            onClick={handleDeleteAll}
          >
            Delete All
          </Button>
          <Button variant="outlined" startIcon={<MarkChatReadIcon />}>
            Mark As Read All
          </Button>
        </div>
        {notify.data.map((item, index) => (
          <MovieNewsItem
            key={index}
            notify={item}
            handleIsRead={handleIsRead}
            handleDeleteSingleNotify={handleDeleteSingleNotify}
            isRead={!item.seenUsers.includes(UserData._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Movie_News_List;
