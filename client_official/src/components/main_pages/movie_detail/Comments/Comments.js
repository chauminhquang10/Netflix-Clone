import React, { useState, useContext, useEffect } from "react";

import { GlobalState } from "../../../../GlobalState";

import axios from "axios";

import { Button, Input } from "antd";

import SingleComment from "./SingleComment";
import ReplyComment from "./ReplyComment";

const { TextArea } = Input;

const Comments = ({
  movieId,
  commentList,
  setCommentList,
  commentCallback,
  setCommentCallback,
}) => {
  const [commentContent, setCommentContent] = useState("");

  const [replyNumbers, setReplyNumbers] = useState(0);

  const state = useContext(GlobalState);
  const [token] = state.token;

  const [user] = state.usersAPI.userData;

  useEffect(() => {
    if (commentList) {
      let parentCommentList = commentList.filter(
        (comment) => !comment.responseTo
      );
      setReplyNumbers(parentCommentList.length);
    }
  }, [commentList]);

  const handleChange = (e) => {
    setCommentContent(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const commentDetail = {
      content: commentContent,
      writer: user,
      movieId: movieId,
    };

    try {
      await axios.post("/api/saveComment", commentDetail, {
        headers: { Authorization: token },
      });
      setCommentContent("");
      setCommentCallback(!commentCallback);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  return (
    <div style={{ backgroundColor: "white", color: "black" }}>
      <br />
      <p>{replyNumbers} replies</p>
      <hr />

      {/* Comment List */}
      {commentList &&
        commentList.map(
          (comment, index) =>
            !comment.responseTo && (
              <>
                <SingleComment
                  comment={comment}
                  movieId={movieId}
                  commentCallback={commentCallback}
                  setCommentCallback={setCommentCallback}
                ></SingleComment>
                <ReplyComment
                  commentList={commentList}
                  movieId={movieId}
                  commentCallback={commentCallback}
                  setCommentCallback={setCommentCallback}
                  parentCommentID={comment._id}
                />
              </>
            )
        )}

      {/* Comment Form */}
      <br></br>
      <h5>Your comment</h5>
      <form style={{ display: "flex" }} onSubmit={onSubmit}>
        <TextArea
          style={{ width: "100%", borderRadius: "5px" }}
          placeholder="write some comment"
          value={commentContent}
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
    </div>
  );
};

export default Comments;
