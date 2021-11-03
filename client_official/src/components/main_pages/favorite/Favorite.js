import React, { useContext } from "react";
import { GlobalState } from "../../../GlobalState";
import { HighlightOff } from "@material-ui/icons";
import "./Favorite.css";
import axios from "axios";

const Favorite = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [watchList, setWatchList] = state.usersAPI.watchList;

  //update lại watchlist dưới db khi xóa item đi
  const updateWatchList = async (watchList) => {
    await axios.patch(
      "/user/addwatchlist",
      { watchlist: watchList },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  };

  const removeMovie = (id) => {
    if (window.confirm("Do you want to remove this movie?")) {
      watchList.forEach((item, index) => {
        if (item._id === id) {
          watchList.splice(index, 1);
        }
      });
      setWatchList([...watchList]);
      updateWatchList(watchList);
    }
  };

  if (watchList.length === 0)
    return (
      <div style={{ minHeight: "700px" }}>
        <h2
          style={{ textAlign: "center", fontSize: "2rem", marginTop: "50px" }}
        >
          Watchlist Empty
        </h2>
      </div>
    );
  return (
    <div style={{ minHeight: "1000px" }}>
      {watchList.map((movie) => (
        <div className="detail watchlist">
          <img src={movie.img.url} alt=""></img>
          <div className="box_detail">
            <h2>{movie.title}</h2>
            <span>year: {movie.year}</span>
            <p>{movie.desc}</p>
            <p>{movie.duration}p</p>
            <p>{movie.limitAge}+</p>
            <div className="delete" onClick={() => removeMovie(movie._id)}>
              <HighlightOff></HighlightOff>
            </div>
          </div>
        </div>
      ))}

      <div className="total">
        <h3>Total: {watchList.length}</h3>
      </div>
    </div>
  );
};

export default Favorite;
