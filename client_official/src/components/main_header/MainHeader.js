import React, { useContext } from "react";
import Header from "../header/Header";
import { GlobalState } from "../../GlobalState";

import TopBar from "../Admin_resources/Admin_components/topbar/TopBar";

const MainHeader = () => {
  const state = useContext(GlobalState);
  const [isAdmin] = state.usersAPI.isAdmin;
  return <>{isAdmin ? <TopBar /> : <Header />}</>;
};

export default MainHeader;
