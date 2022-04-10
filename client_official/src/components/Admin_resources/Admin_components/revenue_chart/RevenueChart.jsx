import React, { useEffect, useContext, useState } from "react";
import axios from "axios";

import { GlobalState } from "../../../../GlobalState";

import "./RevenueChart.css";

import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RevenueChart = () => {
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

  const [monthRevenueStats, setMonthRevenueStats] = useState([]);

  useEffect(() => {
    const getMonthRevenueStats = async () => {
      try {
        const res = await axios.get("/api/monthStats", {
          headers: {
            Authorization: token,
          },
        });
        const statsList = res.data.sort(function (a, b) {
          return a._id - b._id;
        });
        statsList.map((item) =>
          setMonthRevenueStats((prev) => [
            ...prev,
            { name: months[item._id - 1], Total: item.total },
          ])
        );
      } catch (error) {
        console.log(error);
      }
    };
    getMonthRevenueStats();
  }, [token]);

  return (
    <div className="revenue_chart">
      <div className="revenue_chart_title">Monthly Revenue (Now)</div>
      <ResponsiveContainer width="100%" aspect={2 / 1}>
        <AreaChart
          width={730}
          height={250}
          data={monthRevenueStats}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" />
          <CartesianGrid strokeDasharray="3 3" className="revenue_chart_grid" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
