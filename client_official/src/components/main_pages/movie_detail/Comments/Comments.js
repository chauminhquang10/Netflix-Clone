import React, { useState, useContext, useEffect } from "react";

import { GlobalState } from "../../../../GlobalState";

import { Button, Input } from "antd";

import axios from "axios";

import StarRating from "../CommentStarRating/StarRating";
const { TextArea } = Input;

const Comments = ({ productDetail, comments, setComments, isShow }) => {
  const state = useContext(GlobalState);
  const [token] = state.token;

  const [user, setUser] = state.userAPI.user;

  const [callback, setCallback] = state.productsAPI.callback;

  const [comment, setComment] = useState("");

  const [commentCallback, setCommentCallback] = useState(false);

  const [rating, setRating] = useState(null);

  const [length, setLength] = useState(0);

  const [starArray, setStarArray] = useState([]);

  const [totalStar, setToTalStar] = useState(0);

  useEffect(() => {
    const getStarArray = (totalComments) => {
      if (totalComments !== null) {
        totalComments.map((comment) => {
          return setStarArray([...starArray, starArray.push(comment.star)]);
        });
      }
    };

    const getToTalStar = (totalComments) => {
      getStarArray(totalComments);
      let tempTotalStar = 0;
      for (let i = 0; i < starArray.length; i++) {
        tempTotalStar += starArray[i];
      }
      setToTalStar(tempTotalStar);
    };
  }, [productDetail, callback]);

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      if (rating !== null) {
        await axios.post("/api/saveComment", commentDetail, {
          headers: { Authorization: token },
        });
        setRating(null);
        setStarArray([]);
        setToTalStar(0);
        setLength(0);
      } else {
        alert("Please choose a star valuation!");
      }
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  return (
    <div className="Comment_container">
      <StarRating rating={rating} setRating={setRating}></StarRating>
    </div>
  );
};

export default Comments;
