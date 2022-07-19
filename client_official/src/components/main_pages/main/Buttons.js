import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";

const Buttons = ({ movie, deleteMovie }) => {
  const state = useContext(GlobalState);
  const addToWatchList = state.usersAPI.addToWatchList;
  const [isAdmin] = state.usersAPI.isAdmin;
  return (
    <div className="row_btn">
      {isAdmin ? (
        <>
          <Link
            id="btn_favorite"
            to="#!"
            onClick={() => deleteMovie(movie._id, movie.img.public_id)}
          >
            Delete
          </Link>
          <Link id="btn_view" to={`/edit_movie/${movie._id}`}>
            Edit
          </Link>
        </>
      ) : (
        <>
          <Link id="btn_favorite" to="#!" onClick={() => addToWatchList(movie)}>
            Watch Later
          </Link>
          <Link id="btn_view" to={`/detail/${movie._id}`}>
            Detail
          </Link>
        </>
      )}
    </div>
  );
};

export default Buttons;
