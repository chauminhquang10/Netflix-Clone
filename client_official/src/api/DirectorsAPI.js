import { useState, useEffect } from "react";
import axios from "axios";

const DirectorsAPI = () => {
  const [directors, setDirectors] = useState([]);
  useEffect(() => {
    const getDirectors = async () => {
      const res = await axios.get("/api/directors");
      setDirectors(res.data);
    };
    getDirectors();
  }, []);
  return {
    directors: [directors, setDirectors],
  };
};

export default DirectorsAPI;
