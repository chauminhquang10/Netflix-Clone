import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./HomePage.css";
import FeaturedInfo from "../../Admin_components/featuredInfo/FeaturedInfo";
import Chart from "../../Admin_components/chart/Chart";
import WidgetLarge from "../../Admin_components/WidgetLarge/WidgetLarge";
import WidgetSmall from "../../Admin_components/widgetSmall/WidgetSmall";
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

  return (
    <div className="admin-home">
      <FeaturedInfo />
      <Chart
        data={userStats}
        title="User Analytics"
        grid={true}
        dataKey="New User"
      ></Chart>
      <div className="homeWidgets">
        <WidgetSmall></WidgetSmall>
        <WidgetLarge></WidgetLarge>
      </div>
    </div>
  );
};

export default HomePage;
