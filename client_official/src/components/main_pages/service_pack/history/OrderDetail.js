import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { GlobalState } from "../../../../GlobalState";
import moment from "moment";

const OrderDetail = () => {
  const state = useContext(GlobalState);
  const [userHistory] = state.usersAPI.userHistory;
  const [orderDetails, setOrderDetails] = useState([]);

  const params = useParams();

  useEffect(() => {
    if (params.id) {
      userHistory.forEach((item) => {
        if (item._id === params.id) {
          setOrderDetails(item);
        }
      });
    }
  }, [params.id, userHistory]);

  if (orderDetails.length === 0) return null;

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Postal Code</th>
            <th>Country Code</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{orderDetails.address.recipient_name}</td>
            <td>
              {orderDetails.address.line1 + " - " + orderDetails.address.city}
            </td>
            <td>{orderDetails.address.postal_code}</td>
            <td>{orderDetails.address.country_code}</td>
          </tr>
        </tbody>
      </table>
      <br></br>
      <div>
        <h4>Package Name: {orderDetails.service_pack.title}</h4>
        <h4>
          Package Price:{" "}
          {orderDetails.service_pack.price - orderDetails.discountPrice}
        </h4>
        <h4>Started Time: {orderDetails.service_pack.startedTime}</h4>

        <h4>Expire In: {orderDetails.service_pack.expireTime}</h4>
      </div>
    </>
  );
};

export default OrderDetail;
