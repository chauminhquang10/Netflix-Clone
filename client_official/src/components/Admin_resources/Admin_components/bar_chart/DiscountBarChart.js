import React, { useEffect, useContext, useState } from "react";
import axios from "axios";

import { GlobalState } from "../../../../GlobalState";

import "./DiscountBarChart.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DiscountBarChart = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const state = useContext(GlobalState);

  const [token] = state.token;

  const [discountsStats, setDiscountsStats] = useState([]);

  useEffect(() => {
    const getDiscountsStats = async () => {
      try {
        const res = await axios.get("/api/discountStats", {
          headers: {
            Authorization: token,
          },
        });
        const statsList = res.data.sort(function (a, b) {
          return a._id - b._id;
        });
        statsList.map((item) =>
          setDiscountsStats((prev) => [
            ...prev,
            { name: months[item._id - 1], amount: item.total },
          ])
        );
      } catch (error) {
        console.log(error);
      }
    };
    getDiscountsStats();
  }, [token]);

  return (
    <BarChart
      width={800}
      height={300}
      data={discountsStats}
      barSize={30}
      margin={{ top: 10, right: 30, left: 100, bottom: 0 }}
    >
      <XAxis dataKey="name" scale="point" padding={{ left: 50, right: 50 }} />
      <YAxis />
      <Tooltip />
      <Legend />
      <CartesianGrid strokeDasharray="3 3" />
      <Bar dataKey="amount" fill="#8884d8" background={{ fill: "#eee" }} />
    </BarChart>
  );
};

export default DiscountBarChart;
