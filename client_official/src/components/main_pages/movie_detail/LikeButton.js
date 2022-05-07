import React from "react";
import FavoriteOutlinedIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorder";

const LikeButton = ({ isLike, handleLike, handleUnLike }) => {
  return (
    <>
      {isLike ? (
        <FavoriteOutlinedIcon onClick={handleUnLike} fontSize="large" />
      ) : (
        <FavoriteBorderOutlinedIcon onClick={handleLike} fontSize="large" />
      )}
    </>
  );
};

export default LikeButton;
