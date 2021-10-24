import React, { useState, useEffect } from "react";
import axios from "axios";

const GenresAPI = () => {
  const [genres, setGenres] = useState([]);
  const [genresCallback, setGenresCallback] = useState(false);
  useEffect(() => {
    const getGenres = async () => {
      const res = await axios.get("/api/genres");
      setGenres(res.data);
    };
    getGenres();
  }, [genresCallback]);
  return {
    genres: [genres, setGenres],
    genresCallback: [genresCallback, setGenresCallback],
  };
};

export default GenresAPI;
