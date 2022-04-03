import React, { useEffect, useContext, useState } from "react";
import axios from "axios";

import { GlobalState } from "../../../../GlobalState";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#F4A460",
  "#FF0000",
  "#FFFF00",
  "#F19373",
  "#5BBD2B",
  "#C57CAC",
];

const DiscountQuantityLineChart = () => {
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

  const [discountQuantityStats, setDiscountQuantityStats] = useState([]);

  const [numberOfDiscounts, setNumberOfDiscounts] = useState(0);

  const [dataKeyObject, setDataKeyObject] = useState({});

  useEffect(() => {
    const getDiscountQuantityStats = async () => {
      try {
        const res = await axios.get("/api/discountQuantityStats", {
          headers: {
            Authorization: token,
          },
        });

        setNumberOfDiscounts(res.data.discountsLength);

        // lấy 1 tháng đầu tiên ra để truy xuất các datakey
        setDataKeyObject(res.data.finalResult[0]);

        res.data.finalResult.map((item) =>
          setDiscountQuantityStats((prev) => [
            ...prev,
            { ...item, name: months[item._id - 1] },
          ])
        );
      } catch (error) {
        console.log(error);
      }
    };
    getDiscountQuantityStats();
  }, [token]);

  return (
    <LineChart width={800} height={300} data={discountQuantityStats}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
      <YAxis />
      <Tooltip />
      <Legend />

      {[...Array(numberOfDiscounts)].map((entry, index) => {
        return (
          <Line
            type="monotone"
            dataKey={Object.keys(dataKeyObject)[index + 1]}
            stroke={COLORS[index % COLORS.length]}
            activeDot={{ r: 6 }}
          />
        );
      })}
    </LineChart>
  );
};

export default DiscountQuantityLineChart;
