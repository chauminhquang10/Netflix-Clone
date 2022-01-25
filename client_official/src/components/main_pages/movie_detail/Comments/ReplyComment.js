import React, { useState, useEffect } from "react";

import SingleComment from "./SingleComment";

const ReplyComment = ({
  commentList,
  movieId,
  commentCallback,
  setCommentCallback,
  parentCommentID,
}) => {
  const [childCommentNumber, setChildCommentNumber] = useState(0);

  const [openReplyComments, setOpenReplyComments] = useState(false);

  useEffect(() => {
    let commentNumber = 0;
    commentList.map((comment) => {
      if (comment.responseTo === parentCommentID) {
        commentNumber++;
      }
    });
    setChildCommentNumber(commentNumber);
  }, [commentList]);

  const handleClick = () => {
    setOpenReplyComments(!openReplyComments);
  };

  return (
    <div>
      {childCommentNumber > 0 && (
        <p
          style={{ fontSize: "14px", margin: 0, color: "gray" }}
          onClick={handleClick}
        >
          View more {childCommentNumber} comment(s)
        </p>
      )}

      {/* Comments List */}
      {openReplyComments && (
        <div>
          {commentList &&
            commentList.map((comment, index) => (
              <div style={{ marginLeft: "50px", width: "80%" }}>
                {comment.responseTo === parentCommentID && (
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
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ReplyComment;
