import React, { useState } from "react";
import "./PostCard.css";
import {
  Favorite,
  Comment,
  Share,
  Info,
  FavoriteBorder,
} from "@material-ui/icons";

const PostCard = ({ post, socket, userData }) => {
  const [liked, setLiked] = useState(false);

  const handleNotification = (type) => {
    type === 1 && setLiked(true);
    socket.emit("sendNotification", {
      senderName: userData.name,
      receiverName: post.username,
      type,
    });
  };

  return (
    <div className="card" style={{ color: "gray" }}>
      <div className="info">
        <img src={post.userImg} alt="" className="userImg" />
        <span>{post.fullname}</span>
      </div>
      <img src={post.postImg} alt="" className="postImg" />
      <div className="interaction">
        {liked ? (
          <Favorite
            className="cardIcon"
            style={{ fontSize: "40px", marginLeft: "1.5rem" }}
          />
        ) : (
          <FavoriteBorder
            className="cardIcon"
            style={{ fontSize: "40px", marginLeft: "1.5rem" }}
            onClick={() => handleNotification(1)}
          />
        )}

        <Comment
          className="cardIcon"
          style={{ fontSize: "40px", marginLeft: "1.5rem" }}
          onClick={() => handleNotification(2)}
        />
        <Share
          className="cardIcon"
          style={{ fontSize: "40px", marginLeft: "1.5rem" }}
          onClick={() => handleNotification(3)}
        />
        <Info
          className="cardIcon infoIcon"
          style={{ fontSize: "40px", marginLeft: "1.5rem" }}
        />
      </div>
    </div>
  );
};

export default PostCard;
