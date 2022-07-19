import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import "./Survery.scss";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Survery = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [genres] = state.genresAPI.genres;
  const [activeGenres, setActiveGenres] = useState([]);
  const history = useHistory();

  const handleClickCardItem = (genreItem) => {
    const check = activeGenres.every((item) => {
      return item._id !== genreItem._id;
    });

    if (check) {
      setActiveGenres([...activeGenres, { ...genreItem }]);
    } else {
      const newActiveGenres = activeGenres.filter((item) => {
        return item._id !== genreItem._id;
      });

      setActiveGenres([...newActiveGenres]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const finalResult = activeGenres.map((item) => ({
        id: item._id,
        viewCount: 50,
      }));
      await axios.patch(
        "/user/countLikes",
        {
          likedGenres: finalResult,
        },
        {
          headers: { Authorization: token },
        }
      );
      history.push("/browse");
    } catch (error) {
      alert(error.response.data.msg);
    }
  };
  return (
    <div className="survery-container">
      <div>Select Atleast 3 Genres You Like Most</div>
      <div className="survery-content">
        {genres.map((item) => {
          let checkItem = activeGenres.find(
            (element) => element._id === item._id
          );
          return (
            <div
              className={`${
                checkItem ? "item-container active" : "item-container"
              }  `}
              key={item._id}
              onClick={() => {
                handleClickCardItem(item);
              }}
              role="button"
            >
              <img
                src="https://i.ytimg.com/vi/dDjq0yf9g_8/maxresdefault.jpg"
                alt=""
                className="item-image"
              ></img>
              <div className="item-desc">
                <span>{item.name}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="button-group">
        <button
          className="survey-button"
          disabled={activeGenres.length >= 3 ? false : true}
          onClick={(e) => handleSubmit(e)}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Survery;
