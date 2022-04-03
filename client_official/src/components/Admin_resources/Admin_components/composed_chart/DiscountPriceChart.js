import React, { useEffect, useContext, useState } from "react";
import axios from "axios";

import { GlobalState } from "../../../../GlobalState";

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const DiscountPriceChart = () => {
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

  const [discountPriceStats, setDiscountPriceStats] = useState([]);

  useEffect(() => {
    const getDiscountPriceStats = async () => {
      try {
        const res = await axios.get("/api/discountPriceStats", {
          headers: {
            Authorization: token,
          },
        });
        const statsList = res.data.sort(function (a, b) {
          return a._id - b._id;
        });
        statsList.map((item) =>
          setDiscountPriceStats((prev) => [
            ...prev,
            { name: months[item._id - 1], amount: item.total },
          ])
        );
      } catch (error) {
        console.log(error);
      }
    };
    getDiscountPriceStats();
  }, [token]);

  return (
    <ComposedChart
      width={800}
      height={300}
      data={discountPriceStats}
      margin={{
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      }}
    >
      <CartesianGrid stroke="#f5f5f5" />
      <XAxis dataKey="name" scale="band" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="amount" barSize={20} fill="#8884d8" />
      <Line type="monotone" dataKey="amount" stroke="#ff7300" />
    </ComposedChart>
  );
};

export default DiscountPriceChart;
