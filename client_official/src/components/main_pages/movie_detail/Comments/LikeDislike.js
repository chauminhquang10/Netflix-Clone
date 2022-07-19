import React, { useState, useEffect } from "react";
import { Tooltip } from "antd";
import {
  DislikeOutlined,
  LikeOutlined,
  DislikeFilled,
  LikeFilled,
} from "@ant-design/icons";

import axios from "axios";

const LikeDislike = ({ comment, user, token }) => {
  const [likesNumber, setLikesNumber] = useState(0);

  const [likeAction, setLikeAction] = useState(null);

  const [dislikesNumber, setDislikesNumber] = useState(0);

  const [dislikeAction, setDislikeAction] = useState(null);

  const [loadLike, setLoadLike] = useState(false);
  const [loadDislike, setLoadDislike] = useState(false);

  let variables = {
    userId: user._id,
    commentId: comment._id,
  };

  useEffect(() => {
    const getLikes = async () => {
      const res = await axios.get("/api/getLikes", variables);

      setLikesNumber(res.data.length);

      res.data.forEach((like) => {
        if (like.userId === user._id) {
          setLikeAction("liked");
        }
      });
    };

    getLikes();
  }, [comment._id]);

  useEffect(() => {
    const getDislikes = async () => {
      const res = await axios.get("/api/getDislikes", variables);

      setDislikesNumber(res.data.length);

      res.data.forEach((dislike) => {
        if (dislike.userId === user._id) {
          setDislikeAction("disliked");
        }
      });
    };

    getDislikes();
  }, [comment._id]);

  const onLike = async () => {
    if (loadLike) return;
    setLoadLike(true);
    if (likeAction === null) {
      try {
        await axios.post("/api/upLike", variables, {
          headers: { Authorization: token },
        });
        setLikesNumber(likesNumber + 1);
        setLikeAction("liked");

        // nếu nút dislike đã được nhấn (người dùng đã dislike trước đó)
        if (dislikeAction !== null) {
          setDislikeAction(null);
          setDislikesNumber(dislikesNumber - 1);
        }
      } catch (error) {
        alert(error.response.data.msg);
      }
    } else {
      try {
        await axios.post("/api/unLike", variables, {
          headers: { Authorization: token },
        });
        setLikesNumber(likesNumber - 1);
        setLikeAction(null);
      } catch (error) {
        alert(error.response.data.msg);
      }
    }
    setLoadLike(false);
  };

  const onDislike = async () => {
    if (loadDislike) return;
    setLoadDislike(true);
    if (dislikeAction !== null) {
      try {
        await axios.post("/api/unDislike", variables, {
          headers: { Authorization: token },
        });
        setDislikesNumber(dislikesNumber - 1);
        setDislikeAction(null);
      } catch (error) {
        alert(error.response.data.msg);
      }
    } else {
      try {
        await axios.post("/api/upDislike", variables, {
          headers: { Authorization: token },
        });
        setDislikesNumber(dislikesNumber + 1);
        setDislikeAction("disliked");

        // nếu nút like đã được nhấn (người dùng đã like trước đó)
        if (likeAction !== null) {
          setLikeAction(null);
          setLikesNumber(likesNumber - 1);
        }
      } catch (error) {
        alert(error.response.data.msg);
      }
    }
    setLoadDislike(false);
  };

  return (
    <>
      <Tooltip key="comment-basic-like" title="Like">
        <span style={{ cursor: "pointer" }} onClick={onLike}>
          {React.createElement(
            likeAction === "liked" ? LikeFilled : LikeOutlined
          )}

          <span style={{ paddingLeft: "8px", cursor: "auto" }}>
            {likesNumber}
          </span>
        </span>
      </Tooltip>
      &nbsp;&nbsp;
      <Tooltip key="comment-basic-dislike" title="Dislike">
        <span style={{ cursor: "pointer" }} onClick={onDislike}>
          {React.createElement(
            dislikeAction === "disliked" ? DislikeFilled : DislikeOutlined
          )}

          <span style={{ paddingLeft: "8px", cursor: "auto" }}>
            {dislikesNumber}
          </span>
        </span>
      </Tooltip>
    </>
  );
};

export default LikeDislike;
