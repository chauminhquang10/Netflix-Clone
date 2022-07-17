import React, { useContext, useState } from "react";
import { GlobalState } from "../../../../GlobalState";
import "./OrderHistory.scss";
import PaymentDetail from "./OrderDetail";
import moment from "moment";

const OrderHistory = () => {
  const state = useContext(GlobalState);
  const [userHistory] = state.usersAPI.userHistory;
  const [ID, setID] = useState("");
  return (
    <div className="section-history">
      <div
        className="section-history-container"
        onClick={() => ID && setID("")}
      >
        <div className="content-container">
          <div className="left-content">Payment History</div>
          <div className="right-content">
            <div className="right-content-title">
              <div className="column-title">Payment ID</div>
              <div className="column-title">Purchase Date</div>
              <div className="column-title">Action</div>
              <div></div>
            </div>
            {userHistory.map((items) => {
              return (
                <div className="content">
                  <div>{items.paymentID}</div>
                  <div>
                    {moment(new Date(items.createdAt)).format("MMMM Do YYYY")}
                  </div>
                  <div onClick={() => setID(items._id)} className="button">
                    View
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {ID && (
        <div className="popup-container">
          <PaymentDetail id={ID} setId={setID} />
          <div className="payment-frame">
            <div className="close" onClick={() => ID && setID("")}>
              X
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
