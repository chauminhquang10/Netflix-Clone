import { useState, useEffect } from "react";
import axios from "axios";

const ActorsAPI = () => {
  const [actors, setActors] = useState([]);
  useEffect(() => {
    const getActors = async () => {
      const res = await axios.get("/api/actors");
      setActors(res.data);
    };
    getActors();
  }, []);
  return {
    actors: [actors, setActors],
  };
};

export default ActorsAPI;
