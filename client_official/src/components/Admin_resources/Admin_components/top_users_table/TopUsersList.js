import React, { useState, useEffect, useContext } from "react";
import { GlobalState } from "../../../../GlobalState";
import axios from "axios";
import "./TopUsersList.css";

import { DataGrid } from "@mui/x-data-grid";

const topUsersColumns = [
  { field: "id", headerName: "ID", width: 230 },
  {
    field: "user",
    headerName: "User",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.avatar} alt="avatar" />
          {params.row.name}
        </div>
      );
    },
  },
  {
    field: "totalPayments",
    headerName: "No.Payments",
    width: 180,
  },
  {
    field: "totalSpending",
    headerName: "Amount Paid",
    width: 180,
  },
];

const TopUsersList = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [topUsersStats, setTopUsersStats] = useState([]);
  useEffect(() => {
    const getTopUsersStats = async () => {
      try {
        const res = await axios.get("/api/topUsersStats", {
          headers: {
            Authorization: token,
          },
        });

        if (res.data.length !== 0) {
          const statsList = res.data.map(({ _id, ...item }) => ({
            id: _id,
            ...item,
          }));

          console.log(statsList);

          setTopUsersStats(statsList);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getTopUsersStats();
  }, [token]);
  return (
    <div className="top_users_list">
      <div className="top_users_datatable">
        {topUsersStats.length !== 0 ? (
          <DataGrid
            rows={topUsersStats}
            columns={topUsersColumns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        ) : (
          <h4>No data to display</h4>
        )}
      </div>
    </div>
  );
};

export default TopUsersList;
