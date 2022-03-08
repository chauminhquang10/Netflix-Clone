import React, { useState, useContext, useEffect } from "react";

import { GlobalState } from "../../../GlobalState";

import { Link, useHistory } from "react-router-dom";

import axios from "axios";

import "./CheckOutStep.css";

import PayPalCheckOut from "./PayPalCheckOut";

import moment from "moment";

const CheckOutStep = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [userPackage, setUserPackage] = state.usersAPI.userPackage;
  const [packages] = state.packagesAPI.packages;
  const [isValidAccount, setIsValidAccount] = state.usersAPI.isValidAccount;
  const [isNotExpireAccount, setIsNotExpireAccount] =
    state.usersAPI.isNotExpireAccount;

  const [historyCallback, setHistoryCallback] = state.usersAPI.historyCallback;

  const [checkOutPackage, setCheckOutPackage] = useState({});

  const history = useHistory();

  useEffect(() => {
    if (packages.length !== 0) {
      // ktra gói khách hàng chọn có bị admin xóa k ?
      if (
        userPackage.title &&
        packages.some((pack) => pack.title === userPackage.title)
      ) {
        setCheckOutPackage(userPackage);
      } else {
        let currentDate = moment().format("MMMM Do YYYY");
        let expireDate = moment().add(30, "days").format("MMMM Do YYYY");
        //lấy gói đầu tiên
        setCheckOutPackage({
          ...packages[0],
          startedTime: currentDate,
          expireTime: expireDate,
        });
      }
    }
  }, [userPackage, packages]);

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

  const updateBuyPackage = async (userBuyPackage) => {
    await axios.patch(
      "/user/buypackage",
      {
        buy_package: userBuyPackage,
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
      { service_pack: checkOutPackage, paymentID, address },
      {
        headers: { Authorization: token },
      }
    );

    setUserPackage({});
    updateUserPackage({});
    updateBuyPackage(checkOutPackage);

    alert("You have check out successfully");
    setHistoryCallback(!historyCallback);

    setIsValidAccount(true);
    setIsNotExpireAccount(true);

    // chuyển trang
    history.push("/browse");
  };

  return (
    <div className="checkout_step_container">
      <div className="checkout_step_wrapper">
        <div className="checkout_step_number">
          Step <span className="checkout_step_bold_number">3</span> of
          <span className="checkout_step_bold_number"> 3</span>
        </div>
        <h2 className="choice_text_checkout_step">
          Set up your credit or debit card
        </h2>
        <div className="checkout_step_logos">
          <img
            alt=""
            src="https://assets.nflxext.com/ffe/siteui/acquisition/payment/svg/visa-v3.svg"
          ></img>
          <img
            alt=""
            src="https://assets.nflxext.com/ffe/siteui/acquisition/payment/svg/mastercard-v2.svg"
          ></img>
          <img
            alt=""
            src="https://assets.nflxext.com/ffe/siteui/acquisition/payment/svg/amex-v2.svg"
          ></img>
        </div>
        {checkOutPackage.title ? (
          <Link to="/step_2">
            <button type="button" className="checkout_step_btn">
              <div className="checkout_step_btn_left_content">
                <span className="checkout_step_btn_left_content_title">
                  {checkOutPackage.price}
                  &nbsp;₫/month
                </span>
                <span className="checkout_step_btn_left_content_description">
                  {checkOutPackage.title}
                </span>
              </div>
              <button type="button" className="checkout_step_btn_right_content">
                Change
              </button>
            </button>
          </Link>
        ) : (
          <div>
            <Link to="/step_2">
              <button type="button" className="checkout_step_btn_no_plan">
                Choose Plan
              </button>
            </Link>
          </div>
        )}

        <span className="checkout_step_subtext checkout_step_first_subtext">
          Your payments will be processed internationally. Additional bank fees
          may apply.
        </span>

        <span className="checkout_step_subtext checkout_step_second_subtext">
          By checking the checkbox below, you agree to our{" "}
          <a
            target="_blank"
            href="https://help.netflix.com/legal/termsofuse"
            className="policy_term_text"
          >
            Terms of Use
          </a>
          ,{" "}
          <a
            target="_blank"
            href="https://help.netflix.com/legal/privacy"
            className="policy_term_text"
          >
            Privacy Statement
          </a>
          , and that you are over 18. Netflix will automatically continue your
          membership and charge the membership fee (currently
          260,000&nbsp;₫/month) to your payment method until you cancel. You may
          cancel at any time to avoid future charges.
        </span>
        {checkOutPackage.title && (
          <PayPalCheckOut
            total={checkOutPackage.price}
            tranSuccess={tranSuccess}
          ></PayPalCheckOut>
        )}
      </div>
    </div>
  );
};

export default CheckOutStep;
