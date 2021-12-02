import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import MovieItem from "./MovieItem";
import Filter from "./Filter";
import LoadMore from "./LoadMore";
import "./Main.css";
import PuffLoader from "react-spinners/PuffLoader";
import axios from "axios";
import Listitem from "../main/list/List";
import Featured from "./Feature/Feature";
import Grid from "./grid/Grid";

const Movies = () => {
  const state = useContext(GlobalState);
  const [isAdmin] = state.usersAPI.isAdmin;
  const [loading, setLoading] = useState(false);
  const [lists, setLists] = state.listsAPI.lists;

  if (loading) {
    return (
      <div className="loading">
        <PuffLoader color={"#36D7B7"} loading={true} size={60} />
      </div>
    );
  }

  return (
    <>
      <Featured
        trailer="https://www.youtube.com/embed/hIR8Ar-Z4hw"
        bigImg="https://res.cloudinary.com/minh-quang-21-kg/image/upload/v1635843565/movie/481123_uqa9vw.jpg"
        titleImg="https://res.cloudinary.com/minh-quang-21-kg/image/upload/v1636270691/movie/41-413750_avengers-logo-png-avengers-age-of-ultron-png-removebg-preview_fepo5g.png"
        smallImg="https://www.themoviedb.org/t/p/w600_and_h900_bestv2/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg"
        desc="Earth's Mightiest Heroes stand as the planet's first line of defense
          against the most powerful threats in the universe. The Avengers began
          as a group of extraordinary individuals who were assembled to defeat
          Loki and his Chitauri army in New York City."
      />
      <div className="main_page">
        {lists.map((list, index) => {
          if (index < 2) {
            return <Listitem movies={list.items} title={list.title}></Listitem>;
          } else {
            return (
              <Grid movies={list.items} title={list.title} index={index}></Grid>
            );
          }
        })}
      </div>
    </>
  );
};

export default Movies;
