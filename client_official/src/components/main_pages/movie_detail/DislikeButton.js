import React from "react";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";

const DislikeButton = ({ isDislike, handleDislike, handleUnDislike }) => {
  return (
    <>
      {isDislike ? (
        <ThumbDownAltIcon onClick={handleUnDislike} fontSize="large" />
      ) : (
        <ThumbDownOffAltOutlinedIcon onClick={handleDislike} fontSize="large" />
      )}
    </>
  );
};

export default DislikeButton;
