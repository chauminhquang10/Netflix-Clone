import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import "./Pages.css";
import Main from "./main/Main";
import Movies from "./movies/Movies";
import Favorite from "./favorite/Favorite";
import Login from "./auth/Login";
import Register from "./auth/Register";
import NotFound from "./utils/notfound/NotFound";
import MovieDetail from "./movie_detail/MovieDetail";
import AdminGenres from "./genres/AdminGenres";
import AdminLists from "./lists/AdminLists";
import CreateMovie from "./create_movie/CreateMovie";
import ActivationEmail from "./auth/ActivationEmail";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import UserProfile from "./profile/UserProfile";
import Watch from "./watch/Watch";

import SideBar from "../Admin_resources/Admin_components/sidebar/SideBar";
import HomePage from "../Admin_resources/pages/homepage/HomePage";
import UserList from "../Admin_resources/pages/userList/UserList";
import EditUser from "../Admin_resources/pages/edit_user/EditUser";
import AdminMovieList from "../Admin_resources/pages/productList/MovieList";
import EditMovie from "../Admin_resources/pages/product/EditMovie";
import NewMovie from "../Admin_resources/pages/newproduct/NewMovie";

import Discounts from "../Admin_resources/pages/discounts/Discounts";

import LandingPage from "../LandingPage/LandingPage";
import { GlobalState } from "../../GlobalState";

import AdminProfile from "../Admin_resources/pages/profile/AdminProfile";

import ServicePackage from "./service_pack/ServicePackage";
import CheckOut from "./service_pack/checkout/CheckOut";
import OrderHistory from "./service_pack/history/OrderHistory";
import OrderDetail from "./service_pack/history/OrderDetail";

import AdminPayments from "./payments/AdminPayments";
import PaymentDetail from "./payments/PaymentDetail";

import Step1 from "./buy_account/Step1";
import Step2 from "./buy_account/Step2";
import Step3 from "./buy_account/Step3";
import CheckOutStep from "./buy_account/CheckOutStep";

const Pages = () => {
  const state = useContext(GlobalState);
  const [isLogged] = state.usersAPI.isLogged;
  const [isAdmin] = state.usersAPI.isAdmin;
  const [isValidAccount] = state.usersAPI.isValidAccount;
  const [isNotExpireAccount] = state.usersAPI.isNotExpireAccount;

  return (
    <div>
      <>
        {isAdmin ? (
          <div className="admin-container">
            <SideBar></SideBar>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route
                exact
                path="/users"
                component={isAdmin ? UserList : NotFound}
              />

              <Route
                path="/edit_user/:id"
                component={isAdmin ? EditUser : NotFound}
              />

              {/* Movie List */}
              <Route
                exact
                path="/movies"
                component={isAdmin ? AdminMovieList : NotFound}
              ></Route>

              {/* Edit phim */}

              <Route
                path="/edit_movie/:id"
                component={isAdmin ? EditMovie : NotFound}
              />

              {/* Tạo phim */}
              <Route
                path="/newMovie"
                component={isAdmin ? NewMovie : NotFound}
              />

              <Route
                path="/profile"
                component={isLogged ? AdminProfile : NotFound}
              />

              {/* Thể loại */}
              <Route
                path="/genres"
                component={isAdmin ? AdminGenres : NotFound}
              />

              {/* List */}
              <Route
                path="/lists"
                component={isAdmin ? AdminLists : NotFound}
              />

              {/* Packages */}
              <Route
                path="/payments"
                exact
                component={isAdmin ? AdminPayments : NotFound}
              />

              <Route
                path="/payments/:id"
                component={isAdmin ? PaymentDetail : NotFound}
              />

              <Route
                path="/discounts"
                exact
                component={isAdmin ? Discounts : NotFound}
              ></Route>

              <Route path="*" component={NotFound} />
            </Switch>
          </div>
        ) : (
          <>
            <Switch>
              <Route exact path="/">
                {isLogged && isValidAccount ? (
                  <Redirect exact from="/" to="/browse" />
                ) : (
                  <LandingPage />
                )}
              </Route>

              <Route exact path="/browse">
                {isLogged && isValidAccount ? <Main /> : <Redirect to="/" />}
              </Route>

              <Route exact path="/step_1">
                {isLogged && !isNotExpireAccount ? (
                  <Step1 />
                ) : (
                  <Redirect to="/" />
                )}
              </Route>

              <Route exact path="/step_2">
                {isLogged && !isNotExpireAccount ? (
                  <Step2 />
                ) : (
                  <Redirect to="/" />
                )}
              </Route>

              <Route exact path="/step_3">
                {isLogged && !isNotExpireAccount ? (
                  <Step3 />
                ) : (
                  <Redirect to="/" />
                )}
              </Route>

              <Route exact path="/checkout_step">
                {isLogged && !isNotExpireAccount ? (
                  <CheckOutStep />
                ) : (
                  <Redirect to="/" />
                )}
              </Route>

              <Route
                path="/movies"
                exact
                component={isLogged ? Movies : LandingPage}
              />
              <Route
                path="/detail/:id"
                component={isLogged ? MovieDetail : LandingPage}
              />
              <Route
                path="/favorite"
                component={isLogged ? Favorite : LandingPage}
              />
              {/* Thử nghiệm mua gói */}
              <Route path="/packages" component={ServicePackage} />
              <Route path="/checkout" component={CheckOut} />
              <Route
                path="/watch/:TMDBid/:id"
                component={isLogged ? Watch : LandingPage}
              />
              <Route path="/login" component={isLogged ? NotFound : Login} />
              <Route
                path="/register"
                component={isLogged ? NotFound : Register}
              />
              <Route
                path="/user/activate/:activation_token"
                component={ActivationEmail}
              />
              <Route
                path="/forgot_password"
                component={isLogged ? NotFound : ForgotPassword}
              />
              <Route
                path="/user/reset/:access_token"
                component={isLogged ? NotFound : ResetPassword}
              />
              <Route
                path="/profile"
                component={isLogged ? UserProfile : NotFound}
              />
              {/* Xem những gói đã mua */}
              <Route
                exact
                path="/history"
                component={isLogged ? OrderHistory : NotFound}
              />
              {/* Xem chi tiết gói đã mua */}
              <Route
                path="/history/:id"
                component={isLogged ? OrderDetail : NotFound}
              />
              <Route path="*" component={NotFound} />
            </Switch>
          </>
        )}
      </>
    </div>
  );
};

export default Pages;
