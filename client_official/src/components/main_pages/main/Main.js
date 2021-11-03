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
      <Featured />
      <div className="main_page">
        {lists.map((list) => {
          return <Listitem movies={list.items} title={list.title}></Listitem>;
        })}
      </div>
    </>
  );
};

export default Movies;
