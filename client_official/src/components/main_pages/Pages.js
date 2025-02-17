import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import "./Pages.css";
import Main from "./main/Main";
import Movies from "./movies/Movies";
import SearchPage from "../main_pages/serchpage/SearchPage";
import Favorite from "./favorite/Favorite";
import Login from "./auth/Login";
import Register from "./auth/Register";
import NotFound from "./utils/notfound/NotFound";
import ActivationEmail from "./auth/ActivationEmail";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import UserProfile from "./profile/UserProfile";
import Watch from "./watch/Watch";

import SideBar from "../Admin_resources/Admin_components/sidebar/SideBar";
import HomePage from "../Admin_resources/pages/homepage/HomePage";
import Analytics from "../Admin_resources/pages/analytics/Analytics";
import UserList from "../Admin_resources/pages/userList/UserList";
import EditUser from "../Admin_resources/pages/edit_user/EditUser";
import AdminMovieList from "../Admin_resources/pages/movies/MovieList";
import Packages from "../Admin_resources/pages/package/Packages";
import PackageDetail from "../Admin_resources/pages/package/packageDetail/PackageDetail";
import EditMovie from "../Admin_resources/pages/product/EditMovie";
import NewMovie from "../Admin_resources/pages/createMovie/NewMovie";
import MovieDetail from "./movie_detail/MovieDetail";
import AdminGenres from "../Admin_resources/pages/genres/AdminGenres";
import AdminDirectors from "../Admin_resources/pages/directors/AdminDirectors";
import AdminActor from "../Admin_resources/pages/actors/AdminActors";
import NewActor from "../Admin_resources/pages/actors/NewActor";
import EditActor from "../Admin_resources/pages/actors/EditActor";
import NewDirector from "../Admin_resources/pages/directors/NewDirector";
import EditDirector from "../Admin_resources/pages/directors/EditDirector";
import AdminLists from "../Admin_resources/pages/lists/AdminLists";
import Person from "./people/People";
import Discounts from "../Admin_resources/pages/discounts/Discounts";

import LandingPage from "../LandingPage/LandingPage";
import { GlobalState } from "../../GlobalState";

import AdminProfile from "../Admin_resources/pages/profile/AdminProfile";

import ServicePackage from "./service_pack/ServicePackage";
import CheckOut from "./service_pack/checkout/CheckOut";
import OrderHistory from "./service_pack/history/OrderHistory";
import OrderDetail from "./service_pack/history/OrderDetail";

import AdminPayments from "../Admin_resources/pages/payments/Payments";
import PaymentDetail from "../Admin_resources/pages/payments/PaymentDetail";

import Step1 from "./buy_account/Step1";
import Step2 from "./buy_account/Step2";
import Step3 from "./buy_account/Step3";
import CheckOutStep from "./buy_account/CheckOutStep";
import Survery from "./survery/Survery";

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

              <Route exact path="/analytics" component={Analytics} />

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
                path="/NewActor"
                component={isAdmin ? NewActor : NotFound}
              />

              <Route
                path="/edit_actor/:id"
                component={isAdmin ? EditActor : NotFound}
              />

              <Route
                path="/NewDirector"
                component={isAdmin ? NewDirector : NotFound}
              />

              <Route
                path="/edit_director/:id"
                component={isAdmin ? EditDirector : NotFound}
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
                exact
                path="/packages"
                component={isAdmin ? Packages : NotFound}
              ></Route>

              {/* Payment */}
              <Route
                path="/packagesdetail/:id"
                component={isAdmin ? PackageDetail : NotFound}
              />

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
                path="/createpackage"
                component={isAdmin ? PackageDetail : NotFound}
              />

              <Route
                path="/discounts"
                exact
                component={isAdmin ? Discounts : NotFound}
              ></Route>

              <Route
                path="/actors"
                exact
                component={isAdmin ? AdminActor : NotFound}
              ></Route>

              <Route
                path="/directors"
                exact
                component={isAdmin ? AdminDirectors : NotFound}
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
                path="/search"
                exact
                component={isLogged ? SearchPage : LandingPage}
              />
              <Route
                path="/survey"
                exact
                component={isLogged ? Survery : LandingPage}
              />
              <Route
                path="/detail/:id"
                component={isLogged ? MovieDetail : LandingPage}
              />
              <Route
                path="/favorite"
                component={isLogged ? Favorite : LandingPage}
              />
              <Route
                path="/person/:id"
                component={isLogged ? Person : LandingPage}
              />
              {/* Thử nghiệm mua gói */}
              <Route path="/packages" component={ServicePackage} />
              <Route path="/checkout" component={CheckOut} />
              <Route
                path="/watch/:TMDBid/:movieId"
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
