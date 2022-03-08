import React, { useContext, useEffect } from "react";
import { GlobalState } from "../../../../GlobalState";
import { Link } from "react-router-dom";
import "./OrderHistory.css";

import moment from "moment";

const OrderHistory = () => {
  const state = useContext(GlobalState);
  const [userHistory] = state.usersAPI.userHistory;

  return (
    <div>
      <h2> History</h2>

      <h4>You have {userHistory.length} ordered</h4>

      <table>
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Date of Purchased</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {userHistory.map((items) => (
            <tr key={items._id}>
              <td>{items.paymentID}</td>
              <td>
                {moment(new Date(items.createdAt)).format("MMMM Do YYYY")}
              </td>
              <td>
                <Link to={`/history/${items._id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderHistory;
