import React from "react";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";

const LikeButton = ({ isLike, handleLike, handleUnLike }) => {
  return (
    <div className="like">
      {isLike ? (
        <ThumbUpAltIcon onClick={handleUnLike} fontSize="large" />
      ) : (
        <ThumbUpOffAltIcon onClick={handleLike} fontSize="large" />
      )}
    </div>
  );
};

export default LikeButton;
