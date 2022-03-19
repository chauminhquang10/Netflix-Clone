import React, { useContext, useState, useEffect } from "react";
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
import VerticalList from "./VerticalList/VerticalList";
import HorizontalList from "./HorizontalList/HorizontalList";

import PopUp from "../utils/popup/PopUp";

const Movies = () => {
  const state = useContext(GlobalState);
  const [isAdmin] = state.usersAPI.isAdmin;
  const [loading, setLoading] = useState(false);
  const [lists, setLists] = state.listsAPI.lists;
  const [listTrigger, setListTrigger] = useState(true);

  const [isNotExpireAccount, setIsNotExpireAccount] =
    state.usersAPI.isNotExpireAccount;

  //trigger Popup
  const [popupTrigger, setPopupTrigger] = useState(false);

  useEffect(() => {
    if (!isNotExpireAccount) {
      setPopupTrigger(true);
    }
  }, [isNotExpireAccount]);

  if (loading) {
    return (
      <div className="loading">
        <PuffLoader color={"#36D7B7"} loading={true} size={60} />
      </div>
    );
  }

  const ToggleTrigger = (value) => {
    setListTrigger(value);
  };

  const getTrigger = () => {
    return listTrigger;
  };

  return (
    <>
      {/* Popup thông báo hết hạn */}

      {/* <div className="popup_container">
        <PopUp trigger={popupTrigger} setTrigger={setPopupTrigger}>
          <h1>My Popup</h1>
          <p>This is the notification that your account is expired</p>
        </PopUp>
      </div> */}

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
          switch (index) {
            case 2:
              return <HorizontalList movies={list.items} />;
            case 3:
              return (
                <Grid
                  movies={list.items}
                  title={list.title}
                  index={index}
                ></Grid>
              );
            default:
              return (
                <Listitem
                  movies={list.items}
                  title={list.title}
                  getTrigger={getTrigger}
                  ToggleTrigger={ToggleTrigger}
                ></Listitem>
              );
          }
        })}
      </div>
    </>
  );
};

export default Movies;
