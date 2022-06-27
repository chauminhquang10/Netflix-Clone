import React, { useState, useContext } from "react";
import { GlobalState } from "../../../../GlobalState";

import "./Lists.css";
import axios from "axios";

const Lists = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [lists, setLists] = state.listsAPI.lists;
  const [genres] = state.genresAPI.genres;
  const [list, setList] = useState("");
  const [genre, setGenre] = useState("");
  const [listsCallback, setListsCallback] = state.listsAPI.listsCallback;
  //update list
  const [onEdit, setOnEdit] = useState(false);
  const [id, setId] = useState("");

  const handleChange = (event) => {
    setGenre(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (onEdit) {
        const res = await axios.put(
          `/api/lists/${id}`,
          { title: list },
          { genre: genre },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        alert(res.data.msg);
      } else {
        const res = await axios.post(
          "/api/lists",
          { name: list },
          { genre: genre },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        alert(res.data.msg);
      }
      setOnEdit(false);
      setList("");
      setGenre("");
      setListsCallback(!listsCallback);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const editList = async (id, title, genre) => {
    setId(id);
    setList(title);
    setGenre(genre);
    setOnEdit(true);
  };

  const deleteList = async (id) => {
    try {
      const res = await axios.delete(`/api/lists/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      alert(res.data.msg);
      setListsCallback(!listsCallback);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  return (
    <div className="lists-wrapper">
      <div className="lists">
        <form onSubmit={handleSubmit}>
          <label htmlFor="list">List</label>
          <input
            type="text"
            name="list"
            value={list}
            onChange={(e) => {
              setList(e.target.value);
            }}
            required
          ></input>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label="Age"
              onChange={handleChange}
            >
              {genres.map((genre) => {
                return <MenuItem value={genre._id}>{genre.name}</MenuItem>;
              })}
            </Select>
          </FormControl>
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
          {lists.map((list) => (
            <div className="row" key={list._id}>
              <p>{list.title}</p>
              <p>{list.genre}</p>
              <div>
                <button
                  onClick={() => editList(list._id, list.title, list.genre)}
                >
                  Edit
                </button>
                <button onClick={() => deleteList(list._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lists;
