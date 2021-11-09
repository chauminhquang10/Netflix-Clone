import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HomePage.css";
import FeaturedInfo from "../../Admin_components/featuredInfo/FeaturedInfo";
import Chart from "../../Admin_components/chart/Chart";
import WidgetLarge from "../../Admin_components/WidgetLarge/WidgetLarge";
import WidgetSmall from "../../Admin_components/widgetSmall/WidgetSmall";

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
  const [userStats, setUserStats] = useState([]);

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await axios.get("/users/stats", {
          headers: {
            token:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNjJmZWIwM2Q0NWQwMjhjNjJlMjc1NyIsImlzQWRtaW4iOnRydWUsImlhdCI6MTYzMzg4NDEzOCwiZXhwIjoxNjM0MzE2MTM4fQ.bMIgOpjcn-aPlL0nRTYct0umO8gw01kfwlQKp8WtGdE",
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

  console.log(userStats);
  return (
    <div className="home">
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
