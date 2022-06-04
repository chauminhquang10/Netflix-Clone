import React from "react";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";

const LikeButton = ({ isLike, handleLike, handleUnLike }) => {
  return (
    <>
      {isLike ? (
        <ThumbUpAltIcon onClick={handleUnLike} fontSize="large" />
      ) : (
        <ThumbUpOffAltIcon onClick={handleLike} fontSize="large" />
      )}
    </>
  );
};

export default LikeButton;
