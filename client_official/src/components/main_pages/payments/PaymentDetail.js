import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";

function PaymentDetail() {
  const state = useContext(GlobalState);
  const [adminHistory] = state.usersAPI.adminHistory;
  const [paymentDetail, setPaymentDetail] = useState([]);

  const params = useParams();

  useEffect(() => {
    if (params.id) {
      adminHistory.forEach((item) => {
        if (item._id === params.id) setPaymentDetail(item);
      });
    }
  }, [params.id, adminHistory]);

  if (paymentDetail.length === 0) return null;

  return (
    <div className="history-page" style={{ flex: 4, color: "black" }}>
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
            <td>{paymentDetail.address.recipient_name}</td>
            <td>
              {paymentDetail.address.line1 + " - " + paymentDetail.address.city}
            </td>
            <td>{paymentDetail.address.postal_code}</td>
            <td>{paymentDetail.address.country_code}</td>
          </tr>
        </tbody>
      </table>

      <div>
        <h4>Package Name: {paymentDetail.service_pack.packId.title}</h4>
        <h4>
          Package Price:{" "}
          {paymentDetail.service_pack.packId.price -
            paymentDetail.discountPrice}
        </h4>
        <h4>Started Time: {paymentDetail.service_pack.startedTime}</h4>

        <h4>Expire In: {paymentDetail.service_pack.expireTime}</h4>
      </div>
    </div>
  );
}

export default PaymentDetail;
