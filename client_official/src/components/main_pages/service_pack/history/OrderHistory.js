import React, { useContext } from "react";
import { GlobalState } from "../../../../GlobalState";
import { Link } from "react-router-dom";
import "./OrderHistory.css";

const OrderHistory = () => {
  const state = useContext(GlobalState);
  const [userHistory] = state.usersAPI.userHistory;

  if (!userHistory) {
    return (
      <div style={{ minHeight: "900px", backgroundColor: "#f9f9f9" }}>
        <h1 style={{ paddingTop: "5rem", fontSize: "60px" }}>History Emty</h1>
      </div>
    );
  }

  return (
    <div>
      <h2> History</h2>

      <h4>Payment ID: {userHistory.paymentID}</h4>
      <h4>
        Date of Purchased:
        {new Date(userHistory.createdAt).toLocaleDateString()}
      </h4>
      <Link to={"/detailHistory"}>View</Link>
    </div>
  );
};

export default OrderHistory;
