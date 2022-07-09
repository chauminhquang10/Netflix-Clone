import React, { useState, useContext, useEffect } from "react";

import { GlobalState } from "../../../../GlobalState";

import axios from "axios";

import { Button, Input } from "antd";

import SingleComment from "./SingleComment";
import ReplyComment from "./ReplyComment";

import StarRating from "../CommentStarRating/StarRating";

const { TextArea } = Input;

const Comments = ({
  movieId,
  commentList,
  setCommentList,
  commentCallback,
  setCommentCallback,
  movieDetailCallback,
  setMovieDetailCallback,
}) => {
  const [commentContent, setCommentContent] = useState("");

  const [replyNumbers, setReplyNumbers] = useState(0);

  const state = useContext(GlobalState);
  const [token] = state.token;

  //const [moviesCallback, setMoviesCallback] = state.moviesAPI.moviesCallback;

  // phần đánh giá sao
  const [rating, setRating] = useState(null);

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
      movieId: movieId,
      star: rating,
    };

    try {
      if (rating !== null) {
        await axios.post("/api/saveComment", commentDetail, {
          headers: { Authorization: token },
        });
        setCommentContent("");
        setCommentCallback(!commentCallback);
        //setMoviesCallback(!moviesCallback);
        setMovieDetailCallback(!movieDetailCallback);
        setRating(null);
      } else {
        alert("Please choose a value of star!");
      }
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        color: "black",
        margin: "3rem",
        padding: "1rem",
      }}
    >
      <br />
      <p>{replyNumbers} replies</p>
      <hr />

      {/* Comment List */}
      {commentList.length > 0 &&
        commentList.map(
          (comment, index) =>
            !comment.responseTo && (
              <>
                <SingleComment
                  comment={comment}
                  movieId={movieId}
                  commentCallback={commentCallback}
                  setCommentCallback={setCommentCallback}
                  // moviesCallback={moviesCallback}
                  // setMoviesCallback={setMoviesCallback}

                  movieDetailCallback={movieDetailCallback}
                  setMovieDetailCallback={setMovieDetailCallback}
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

      <StarRating rating={rating} setRating={setRating}></StarRating>

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
