import React, { useContext } from "react";
import { GlobalState } from "../../../GlobalState";
import { Link } from "react-router-dom";
import "./AdminPayments.css";

const AdminPayments = () => {
  const state = useContext(GlobalState);
  const [adminHistory] = state.usersAPI.adminHistory;

  if (!adminHistory) {
    return (
      <div style={{ minHeight: "900px", backgroundColor: "#f9f9f9" }}>
        <h1 style={{ paddingTop: "5rem", fontSize: "60px" }}>History Emty</h1>
      </div>
    );
  }

  return (
    <div className="history-page" style={{ flex: 4, color: "black" }}>
      <h2>History</h2>

      <h4>You have {adminHistory.length} ordered</h4>

      <table>
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Date of Purchased</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {adminHistory.map((items) => (
            <tr key={items._id}>
              <td>{items.paymentID}</td>
              <td>{new Date(items.createdAt).toLocaleDateString()}</td>
              <td>
                <Link to={`/payments/${items._id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPayments;
