import React, { useContext } from "react";

import { GlobalState } from "../../../../GlobalState";

const OrderDetail = () => {
  const state = useContext(GlobalState);
  const [userHistory] = state.usersAPI.userHistory;

  if (!userHistory) return null;

  return (
    <>
      <div>
        <h2>Order Detail</h2>
        <br></br>
        <h4>Name {userHistory.address.recipient_name}</h4>
        <h4>
          Address {userHistory.address.line1 + " - " + userHistory.address.city}
        </h4>
        <h4>Postal Code {userHistory.address.postal_code}</h4>
        <h4>Country code {userHistory.address.country_code}</h4>
      </div>
      <br></br>
      <div>
        <h4>Package Name: {userHistory.service_pack.title}</h4>
        <h4>Package Price: {userHistory.service_pack.price}</h4>
        <h4>Started Time: {userHistory.service_pack.startedTime}</h4>
        <h4>Expire In: {userHistory.service_pack.expireTime}</h4>
      </div>
    </>
  );
};

export default OrderDetail;
