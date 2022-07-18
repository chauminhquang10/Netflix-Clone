import React, { useState, useCallback, useEffect, useContext } from "react";
import "./PackagePieChart.js.css";

import axios from "axios";

import { GlobalState } from "../../../../GlobalState";

import { PieChart, Pie, Sector, Cell } from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#F4A460",
  "#2596be",
  "#FFFF00",
  "#F19373",
  "#5BBD2B",
  "#C57CAC",
];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`Sold: ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const PackagePieChart = () => {
  const state = useContext(GlobalState);

  const [token] = state.token;

  const [packagesStats, setPackagesStats] = useState([]);

  const [totalSold, setTotalSold] = useState(0);

  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  useEffect(() => {
    const getPackagesStats = async () => {
      try {
        const res = await axios.get("/api/packageStats", {
          headers: {
            Authorization: token,
          },
        });

        setTotalSold(res.data.totalSold);
        const statsList = res.data.allPackages.sort(function (a, b) {
          return a.sold - b.sold;
        });
        statsList.map((item) =>
          setPackagesStats((prev) => [
            ...prev,
            { name: item.title, value: item.sold },
          ])
        );
      } catch (error) {
        console.log(error);
      }
    };
    getPackagesStats();
  }, [token]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h5 style={{ color: "#2596be" }}>Total Package Sold: {totalSold}</h5>
      <PieChart width={800} height={250}>
        <Pie
          data={packagesStats}
          activeIndex={activeIndex}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          activeShape={renderActiveShape}
          onMouseEnter={onPieEnter}
        >
          {packagesStats.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
};

export default PackagePieChart;
