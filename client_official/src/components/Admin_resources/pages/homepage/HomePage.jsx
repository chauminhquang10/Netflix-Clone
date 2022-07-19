import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./HomePage.scss";
import FeaturedInfo from "../../Admin_components/featuredInfo/FeaturedInfo";
import Chart from "../../Admin_components/chart/Chart";
import WidgetLarge from "../../Admin_components/WidgetLarge/WidgetLarge";
import WidgetSmall from "../../Admin_components/widgetSmall/WidgetSmall";
import MovieStrat from "../../Admin_components/widgetSmall/MovieStrat";
import GenreStrat from "../../Admin_components/widgetSmall/GenreStrat";

import RevenueChart from "../../Admin_components/revenue_chart/RevenueChart";
import FeaturedRevenue from "../../Admin_components/featured_revenue/FeaturedRevenue";

import { GlobalState } from "../../../../GlobalState";

const HomePage = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const state = useContext(GlobalState);
  const [token] = state.token;

  const [userStats, setUserStats] = useState([]);
  const [topGenres, setTopGenres] = useState([]);
  const [topMoviesByGenre, setTopMoviesByGenre] = useState([]);

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await axios.get("/user/stats", {
          headers: {
            Authorization: token,
          },
        });
        const statsList = res.data.sort(function (a, b) {
          return a._id - b._id;
        });
        statsList.map((item) =>
          setUserStats((prev) => [
            ...prev,
            { name: months[item._id - 1], "New User": item.total },
          ])
        );
      } catch (error) {
        console.log(error);
      }
    };
    getStats();
  }, []);

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await axios.get("/api/topMoviesStats", {
          headers: {
            Authorization: token,
          },
        });
        if (res?.data) {
          setTopMoviesByGenre(res?.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getStats();
  }, []);

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await axios.get("/api/topGenresStats", {
          headers: {
            Authorization: token,
          },
        });
        if (res?.data) {
          setTopGenres(res?.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getStats();
  }, []);

  return (
    <div className="admin-home">
      <FeaturedInfo />
      <Chart
        data={userStats}
        title="User Analytics"
        grid={true}
        dataKey="New User"
      ></Chart>

      <div className="child-chart">
        <FeaturedRevenue />
        <RevenueChart />
      </div>
      <div className="homeWidgets">
        <MovieStrat movies={topMoviesByGenre} />
        <GenreStrat genres={topGenres} />
      </div>

      <div className="homeWidgets">
        <WidgetSmall></WidgetSmall>
        <WidgetLarge></WidgetLarge>
      </div>
    </div>
  );
};

export default HomePage;
