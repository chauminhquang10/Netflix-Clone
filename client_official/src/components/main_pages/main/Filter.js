import React, { useContext } from "react";
import { GlobalState } from "../../../GlobalState";
import "./Filter.css";

const Filter = () => {
  const state = useContext(GlobalState);
  const [genre, setGenre] = state.moviesAPI.genre;
  const [search, setSearch] = state.moviesAPI.search;
  const [sort, setSort] = state.moviesAPI.sort;
  const [genres] = state.genresAPI.genres;

  const handleGenre = (e) => {
    setGenre(e.target.value);
    setSearch("");
  };

  return (
    <div className="filter_menu">
      <div className="row">
        <span>Filters: </span>
        <select name="genre" value={genre} onChange={handleGenre}>
          <option value="">All Movies</option>
          {genres.map((genre) => (
            <option value={"allGenres=" + genre._id} key={genre._id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      <input
        type="text"
        value={search}
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      ></input>

      <div className="row">
        <span>Sort By: </span>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Newest</option>
          <option value="sort=createdAt">Oldest</option>
          <option value="sort=-limitAge">Limit Age: High-Low</option>
          <option value="sort=limitAge">Limit Age: Low-High</option>
        </select>
      </div>
    </div>
  );
};

export default Filter;
