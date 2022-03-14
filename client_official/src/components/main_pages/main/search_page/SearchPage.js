import React, { useContext, useState, useEffect } from "react";
import axios from "axios";

import { GlobalState } from "../../../../GlobalState";

const SearchPage = () => {
  const state = useContext(GlobalState);
  const [searchGenres, setSearchGenres] = useState([]);
  const [search] = state.moviesAPI.search;

  useEffect(() => {
    const getSearchGenres = async () => {
      const res = await axios.get(`/api/genres?name[regex]=${search}`);
      setSearchGenres(res.data);
    };
    if (search) getSearchGenres();
    else setSearchGenres([]);
  }, [search]);

  return (
    <div>
      {searchGenres.map((genre) => (
        <div key={genre._id}>
          <p>{genre.name}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchPage;
