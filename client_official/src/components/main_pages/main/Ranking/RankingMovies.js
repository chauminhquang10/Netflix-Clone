import React, { useContext } from "react";
import { GlobalState } from "../../../../GlobalState";

const RankingMovies = () => {
  const state = useContext(GlobalState);
  const [topRanking] = state.topRanking;

  return (
    <div>
      {topRanking.map((item) => (
        <h1>{item.title}</h1>
      ))}
    </div>
  );
};

export default RankingMovies;
