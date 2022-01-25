import React, { useState, useContext, useEffect } from "react";
import { Comment, Avatar, Tooltip, Button, Input } from "antd";

import LikeDislike from "./LikeDislike";

import { format } from "timeago.js";

import { GlobalState } from "../../../../GlobalState";
import axios from "axios";

const { TextArea } = Input;

const SingleComment = ({
  comment,
  movieId,
  commentCallback,
  setCommentCallback,
}) => {
  const state = useContext(GlobalState);
  const [token] = state.token;

  const [user] = state.usersAPI.userData;

  const [replyComment, setReplyComment] = useState("");

  const [openReply, setOpenReply] = useState(false);

  const [showEditOptions, setShowEditOptions] = useState(false);

  // const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (comment.writer._id === user._id) {
      setShowEditOptions(true);
    }
  }, [user, comment]);

  const toggleReply = () => {
    setOpenReply(!openReply);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const commentDetail = {
      content: replyComment,
      writer: user,
      movieId: movieId,
      responseTo: comment._id,
    };

    try {
      await axios.post("/api/saveComment", commentDetail, {
        headers: { Authorization: token },
      });
      setReplyComment("");
      setCommentCallback(!commentCallback);
      setOpenReply(!openReply);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    try {
      await axios.delete(`/api/deleteComment/${comment._id}`, {
        headers: { Authorization: token },
      });
      setCommentCallback(!commentCallback);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const action = [
    <LikeDislike comment={comment} user={user} token={token} />,
    <span onClick={toggleReply} key="comment-basic-reply-to">
      Reply to
    </span>,
    <>
      {showEditOptions && (
        <>
          <span onClick key="comment-basic-reply-to">
            Edit
          </span>
          <span
            style={{ marginLeft: "8px" }}
            onClick={handleDelete}
            key="comment-basic-reply-to"
          >
            Delete
          </span>
        </>
      )}
    </>,
  ];

  const handleChange = (e) => {
    setReplyComment(e.target.value);
  };

  return (
    <div>
      <Comment
        actions={action}
        author={comment.writer.name}
        avatar={<Avatar src={comment.writer.avatar} alt="commentor image" />}
        content={<p>{comment.content}</p>}
        datetime={
          <span style={{ marginLeft: "8px" }}>{format(comment.createdAt)}</span>
        }
      ></Comment>

      {/* Comment Form */}
      {openReply && (
        <form style={{ display: "flex" }} onSubmit={onSubmit}>
          <TextArea
            style={{ width: "100%", borderRadius: "5px" }}
            placeholder="write some comment"
            value={replyComment}
            onChange={handleChange}
          ></TextArea>
          <br />
          <Button
            style={{
              width: "20%",
              height: "52px",
              backgroundColor: "black",
              color: "white",
              border: "none",
            }}
            onClick={onSubmit}
          >
            Submit
          </Button>
        </form>
      )}
    </div>
  );
};

export default SingleComment;
