import React, { useState, useEffect } from "react";
import axios from "axios";

const MoviesAPI = () => {
  const [movies, setMovies] = useState([]);
  const getMovies = async () => {
    const res = await axios.get("/api/movies");
    setMovies(res.data.movies);
  };
  useEffect(() => {
    getMovies();
  }, []);
  return {
    movies: [movies, setMovies],
  };
};

export default MoviesAPI;
