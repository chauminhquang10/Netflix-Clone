import React, { useState, useEffect, useContext } from "react";
import "./FeaturedInfo.css";

import axios from "axios";

import { ArrowUpward } from "@material-ui/icons";

import { GlobalState } from "../../../../GlobalState";

const FeaturedInfo = () => {
  const state = useContext(GlobalState);

  const [token] = state.token;

  const [allUsers] = state.usersAPI.allUsers;

  const [adminHistory] = state.usersAPI.adminHistory;

  const [totalUserNumber, setTotalUserNumber] = useState(0);

  const [totalPaymentNumber, setTotalPaymentNumber] = useState(0);

  const [currentMonthRevenue, setCurrentMonthRevenue] = useState(0);

  useEffect(() => {
    if (allUsers.length !== 0) {
      setTotalUserNumber(allUsers.length);
    }
  }, [allUsers]);

  useEffect(() => {
    if (adminHistory.length !== 0) {
      setTotalPaymentNumber(adminHistory.length);
    }
  }, [adminHistory]);

  useEffect(() => {
    const getMonthRevenue = async () => {
      try {
        const res = await axios.get("/api/monthRevenue", {
          headers: {
            Authorization: token,
          },
        });
        setCurrentMonthRevenue(res.data.total);
      } catch (error) {
        console.log(error);
      }
    };
    getMonthRevenue();
  }, [token]);

  return (
    <div className="admin-featured">
      <div className="adminFeaturedItem">
        <span className="adminFeaturedTitle">Users</span>
        <div className="adminFeaturedMoneyContainer">
          <span className="adminFeaturedMoney">{totalUserNumber}</span>
          <span className="adminFeaturedMoneyRate">
            +12 % <ArrowUpward className="adminFeaturedIcon " />
          </span>
        </div>
        <span className="adminFeaturedSub">Compare to last months</span>
      </div>
      <div className="adminFeaturedItem">
        <span className="adminFeaturedTitle">Payments</span>
        <div className="adminFeaturedMoneyContainer">
          <span className="adminFeaturedMoney">{totalPaymentNumber}</span>
          <span className="adminFeaturedMoneyRate">
            {/* -1.1 <ArrowDownward className="adminFeaturedIcon adminNegative" /> */}
            +35 % <ArrowUpward className="adminFeaturedIcon " />
          </span>
        </div>
        <span className="adminFeaturedSub">Compare to last months</span>
      </div>
      <div className="adminFeaturedItem">
        <span className="adminFeaturedTitle">Earnings</span>
        <div className="adminFeaturedMoneyContainer">
          <span className="adminFeaturedMoney">{currentMonthRevenue}₫</span>
          <span className="adminFeaturedMoneyRate">
            +21 % <ArrowUpward className="adminFeaturedIcon " />
          </span>
        </div>
        <span className="adminFeaturedSub">Compare to last months</span>
      </div>
    </div>
  );
};

export default FeaturedInfo;
