import React, { createElement, useState, useContext, useEffect } from "react";
import { Comment, Avatar, Tooltip, Button, Input } from "antd";

import LikeDislike from "./LikeDislike";

import { format } from "timeago.js";

import { GlobalState } from "../../../../GlobalState";
import axios from "axios";

import "./SingleComment.scss";

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

  const [openEdit, setOpenEdit] = useState(false);

  const [showEditOptions, setShowEditOptions] = useState(false);

  const [content, setContent] = useState("");

  useEffect(() => {
    setContent(comment.content);
    if (comment.writer._id === user._id) {
      setShowEditOptions(true);
    }
  }, [user, comment]);

  const toggleReply = () => {
    setOpenReply(!openReply);
  };

  const toggleEdit = () => {
    setOpenEdit(!openEdit);
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

  const handleUpdate = async (event) => {};

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
      {!openReply ? "Reply to" : "Cancel"}
    </span>,
    <>
      {showEditOptions && (
        <>
          <span onClick={toggleEdit} key="comment-basic-reply-to">
            {!openEdit ? "Edit" : "Cancel"}
          </span>
          {openEdit && (
            <span style={{ marginLeft: "8px" }} onClick={handleUpdate}>
              Update
            </span>
          )}
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
        className="AntSingleComment"
        actions={action}
        author={comment.writer.name}
        avatar={<Avatar src={comment.writer.avatar} alt="commentor image" />}
        content={
          openEdit ? (
            <textarea
              rows="5"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          ) : (
            <div>{comment.content}</div>
          )
        }
        datetime={
          <span style={{ marginLeft: "8px" }}>{format(comment.createdAt)}</span>
        }
      ></Comment>

      {/* Comment Form */}
      {openReply && (
        <form style={{ display: "flex" }} onSubmit={onSubmit}>
          <TextArea
            style={{
              width: "100%",
              borderRadius: "5px",
              margin: "0rem 0rem 0rem 2rem",
            }}
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
