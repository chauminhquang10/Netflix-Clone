import React, { useContext } from "react";
import { GlobalState } from "../../../GlobalState";
import { HighlightOff } from "@material-ui/icons";
import "./Favorite.css";
import axios from "axios";
import ListItem from "../main/MovieItem";

const Favorite = () => {
  const state = useContext(GlobalState);
  const [watchList, setWatchList] = state.usersAPI.watchList;

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
    <div className="Fav_container">
      <h2>My Favotites</h2>
      <div className="Fav_item_container">
        {watchList.map((movie) => (
          <ListItem movie={movie}></ListItem>
        ))}
      </div>
      <div className="total">
        <h3>Total: {watchList.length}</h3>
      </div>
    </div>
  );
};

export default Favorite;
