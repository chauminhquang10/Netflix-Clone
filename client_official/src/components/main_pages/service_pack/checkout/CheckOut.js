import React, { useState, useContext } from "react";

import { GlobalState } from "../../../../GlobalState";

import PayPalButton from "./PayPalButton";
import axios from "axios";

const CheckOut = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [userPackage, setUserPackage] = state.usersAPI.userPackage;

  const [historyCallback, setHistoryCallback] = state.usersAPI.historyCallback;

  const updateUserPackage = async (userPackage) => {
    await axios.patch(
      "/user/addpackage",
      {
        service_pack: userPackage,
      },
      {
        headers: { Authorization: token },
      }
    );
  };

  const tranSuccess = async (payment) => {
    const { paymentID, address } = payment;

    await axios.post(
      "/api/payment",
      { service_pack: userPackage, paymentID, address },
      {
        headers: { Authorization: token },
      }
    );

    setUserPackage({});
    updateUserPackage({});

    alert("You have check out successfully");
    setHistoryCallback(!historyCallback);
  };

  return (
    <>
      {userPackage ? (
        <div className="product_card">
          {/* <img src={  userPackage.image.url} alt="" /> */}

          <div className="product_box">
            <h2 title={userPackage.title}>{userPackage.title}</h2>
            <span>${userPackage.price}</span>
            <p>{userPackage.video_quality}</p>
          </div>

          <div>
            <span>From: {userPackage.startedTime}</span>
            <span>
              To:
              {userPackage.expireTime}
            </span>
          </div>

          <div className="total">
            <h3>Total: {userPackage.price}</h3>
            <PayPalButton
              total={userPackage.price}
              tranSuccess={tranSuccess}
            ></PayPalButton>
          </div>
        </div>
      ) : (
        <h2>Empty</h2>
      )}
    </>
  );
};

export default CheckOut;
