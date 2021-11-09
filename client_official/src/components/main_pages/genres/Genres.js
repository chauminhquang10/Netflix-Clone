import React, { useState, useContext } from "react";
import { GlobalState } from "../../../GlobalState";

import "./Genres.css";
import axios from "axios";

const Genres = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [genres, setGenres] = state.genresAPI.genres;
  const [genre, setGenre] = useState("");
  const [genresCallback, setGenresCallback] = state.genresAPI.genresCallback;
  //update genre
  const [onEdit, setOnEdit] = useState(false);
  const [id, setId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (onEdit) {
        const res = await axios.put(
          `/api/genres/${id}`,
          { name: genre },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        alert(res.data.msg);
      } else {
        const res = await axios.post(
          "/api/genres",
          { name: genre },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        alert(res.data.msg);
      }
      setOnEdit(false);
      setGenre("");
      setGenresCallback(!genresCallback);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const editGenre = async (id, name) => {
    setId(id);
    setGenre(name);
    setOnEdit(true);
  };

  const deleteGenre = async (id) => {
    try {
      const res = await axios.delete(`/api/genres/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      alert(res.data.msg);
      setGenresCallback(!genresCallback);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  return (
    <div className="genres-wrapper">
      <div className="genres">
        <form onSubmit={handleSubmit}>
          <label htmlFor="genre">Genre</label>
          <input
            type="text"
            name="genre"
            value={genre}
            onChange={(e) => {
              setGenre(e.target.value);
            }}
            required
          ></input>
          <button type="submit">{onEdit ? "Update" : "Create"}</button>
        </form>
        <div className="col">
          {genres.map((genre) => (
            <div className="row" key={genre._id}>
              <p>{genre.name}</p>
              <div>
                <button onClick={() => editGenre(genre._id, genre.name)}>
                  Edit
                </button>
                <button onClick={() => deleteGenre(genre._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Genres;
