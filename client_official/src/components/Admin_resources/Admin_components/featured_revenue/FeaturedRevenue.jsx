import React, { useEffect, useContext, useState } from "react";
import "./FeaturedRevenue.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { GlobalState } from "../../../../GlobalState";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";

const FeaturedRevenue = () => {
  const state = useContext(GlobalState);

  const [token] = state.token;

  const [todayRevenue, setTodayRevenue] = useState(0);

  useEffect(() => {
    const getTodayRevenue = async () => {
      try {
        const res = await axios.get("/api/todayStats", {
          headers: {
            Authorization: token,
          },
        });
        setTodayRevenue(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getTodayRevenue();
  }, [token]);

  return (
    <div className="featured_revenue">
      <div className="featured_revenue_top">
        <h1 className="featured_revenue_top_title">Total Revenue</h1>
        <MoreVertIcon fontSize="small" />
      </div>
      <div className="featured_revenue_bottom">
        <div className="featured_revenue_bottom_chart">
          <CircularProgressbar
            value={(todayRevenue / 2200) * 100}
            text={Math.round((todayRevenue / 2200) * 100) + "%"}
            strokeWidth={5}
          />
        </div>
        <p className="featured_revenue_bottom_title">Total sales made today</p>
        <p className="featured_revenue_bottom_amount">${todayRevenue}</p>
        <p className="featured_revenue_bottom_description">
          Previous transactions processing. Last payments may not be included.
        </p>
        <div className="featured_revenue_bottom_summary">
          <div className="featured_revenue_bottom_summary_item">
            <div className="featured_revenue_bottom_summary_item_title">
              Target
            </div>
            <div className="featured_revenue_bottom_summary_item_result summary_item_result_negative ">
              <KeyboardArrowDownIcon fontSize="small" />
              <div className="featured_revenue_bottom_summary_item_result_amount">
                $2.200
              </div>
            </div>
          </div>
          <div className="featured_revenue_bottom_summary_item ">
            <div className="featured_revenue_bottom_summary_item_title">
              Last Week
            </div>
            <div className="featured_revenue_bottom_summary_item_result summary_item_result_positive ">
              <KeyboardArrowUpOutlinedIcon fontSize="small" />
              <div className="featured_revenue_bottom_summary_item_result_amount">
                $3.500
              </div>
            </div>
          </div>
          <div className="featured_revenue_bottom_summary_item">
            <div className="featured_revenue_bottom_summary_item_title">
              Last Month
            </div>
            <div className="featured_revenue_bottom_summary_item_result summary_item_result_positive">
              <KeyboardArrowUpOutlinedIcon fontSize="small" />
              <div className="featured_revenue_bottom_summary_item_result_amount">
                $7.865
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedRevenue;
