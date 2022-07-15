import React, { useContext, useState, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import MovieItem from "../main/MovieItem";
import Pagination from "./Pagination";
import "./SearchPage.scss";
import PuffLoader from "react-spinners/PuffLoader";
import axios from "axios";

const SearchPage = () => {
  const state = useContext(GlobalState);
  const [movies, setMovies] = state.moviesAPI.movies;
  const [Choice, setChoice] = state.moviesAPI.search;
  //const [moviesCallback, setMoviesCallback] = state.moviesAPI.moviesCallback;
  const [searchGenres, setSearchGenres] = useState([]);
  const [search, setSearch] = state.moviesAPI.search;
  const nationCodes = ["us", "jp", "uk"];

  const [sort, setSort] = state.moviesAPI.sort;

  //xử lí delete all

  // phân trang trên front end
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage, setMoviesPerPage] = useState(30);

  // index của last Movie tuy là 10 , 20 ,... nhưng hàm slice nó k lấy (nó chỉ lấy 9,19,....)
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
  const [genre, setGenre] = state.moviesAPI.genre;
  const [year, setYear] = state.moviesAPI.year;
  const [original_country, setCountry] = state.moviesAPI.original_country;
  const [genres] = state.genresAPI.genres;

  useEffect(() => {
    const getSearchGenres = async () => {
      const res = await axios.get(`/api/genres?name[regex]=${search}`);
      setSearchGenres(res.data);
    };
    if (search) getSearchGenres();
    else setSearchGenres([]);
  }, [search]);

  //Chuyển trang
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleGenre = (e) => {
    setGenre(e.target.value);
    setSearch("");
  };
  const handleYear = (e) => {
    setYear(e.target.value);
    setSearch("");
  };
  const handleCountry = (e) => {
    setCountry(e.target.value);
    setSearch("");
  };

  return (
    <div className="movies_container">
      <div className="Sort_container">
        {/* phần sorting sắp xếp mới */}
        <div className="Sort_child">
          <select
            className="selection-container"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="sort=-views">Most View</option>
            <option value="sort=-imdb_rating">Best Rating</option>
            <option value="sort=-year">Produce Year</option>
          </select>
        </div>
        <div className="Sort_child">
          <select
            className="selection-container"
            name="genre"
            id="genre"
            onChange={handleGenre}
          >
            <option value="">Genre</option>
            {genres.map((genre) => (
              <option
                className="option"
                value={"allGenres=" + genre._id}
                key={genre._id}
              >
                {String(genre.name).charAt(0).toUpperCase(0) +
                  String(genre.name).slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="Sort_child">
          <select
            className="selection-container"
            name="genre"
            id="genre"
            onChange={handleCountry}
          >
            <option value="">Country</option>
            {nationCodes.map((item) => (
              <option
                className="option"
                key={item}
                value={"original_country=" + item}
              >
                {item.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div className="Sort_child">
          <select
            className="selection-container"
            name="genre"
            id="genre"
            onChange={handleYear}
          >
            <option value="">Release Date</option>
            {Array(12)
              .fill(2010)
              .map((year, index) => (
                <option
                  className="option"
                  value={"year=" + Number(year + index)}
                  key={year + index}
                >
                  {year + index}
                </option>
              ))}
          </select>
        </div>
      </div>
      <div className="related_titles_container">
        <div className="related_titles">Related Titles :</div>
        <div className="related_titles_content">
          {searchGenres.map((genre, index) => {
            return (
              search && (
                <div className="related_titles_content_child_container">
                  <div className="related_titles_content_child">
                    &nbsp; {genre.name} &nbsp;
                  </div>
                  <p className="related_titles_content_child_p">|</p>
                </div>
              )
            );
          })}
          {currentMovies.map((movie, index) => {
            if (search) {
              if (index > currentMovies.length - 1 || index > 10) {
                return;
              } else if (index === currentMovies.length - 1 || index === 10) {
                return (
                  <div className="related_titles_content_child_container">
                    <div
                      className="related_titles_content_child"
                      onClick={() => setChoice(movie.title.toLowerCase())}
                    >
                      &nbsp; {movie.title}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="related_titles_content_child_container">
                    <div
                      className="related_titles_content_child"
                      onClick={() => setChoice(movie.title.toLowerCase())}
                    >
                      &nbsp; {movie.title} &nbsp;
                    </div>
                    <p className="related_titles_content_child_p">|</p>
                  </div>
                );
              }
            }
          })}
        </div>
      </div>
      <div className="movies">
        {currentMovies.map((movie) => {
          return <MovieItem key={movie._id} movie={movie}></MovieItem>;
        })}
      </div>
      <div className="Pagination">
        <Pagination
          moviesPerPage={moviesPerPage}
          totalMovies={movies.length}
          paginate={paginate}
        ></Pagination>
      </div>
      {movies.length === 0 && (
        <div className="loading">
          <PuffLoader color={"#36D7B7"} loading={true} size={60} />
        </div>
      )}
    </div>
  );
};

export default SearchPage;
