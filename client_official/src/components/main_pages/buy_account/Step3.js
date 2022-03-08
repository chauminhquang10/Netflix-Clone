import React from "react";
import "./Step3.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Link } from "react-router-dom";

import LockIcon from "@mui/icons-material/Lock";

const Step3 = () => {
  return (
    <div className="step3_container">
      <div className="step3_wrapper">
        <LockIcon
          style={{ color: "red", fontSize: "45px" }}
          className="step3_logo"
        />

        <div className="step3_number">
          Step <span className="step3_bold_number">3</span> of
          <span className="step3_bold_number"> 3</span>
        </div>
        <h2 className="choice_3_text">Set up your payment</h2>

        <div className="step3_description_content">
          <p>Your membership starts as soon as you set up payment.</p>
          <p style={{ fontWeight: "700" }}>
            No commitments. Cancel online anytime.
          </p>
        </div>
      </div>
      <div className="step3_bottom_content">
        <div className="secure_badge">
          <LockOpenIcon
            style={{ color: "#ffb53f", fontSize: "20px", marginLeft: "2px" }}
          />
          <span>Secure Server</span>
        </div>
        <Link to="/checkout_step">
          <button type="button" className="step3_checkout_btn">
            <div className="step3_checkout_btn_wrapper">
              <div className="step3_checkout_btn_wrapper_name_and_logos">
                <div style={{ float: "left", marginLeft: "15px" }}>
                  <span>Credit or Debit Card</span>
                </div>
                <div style={{ float: "left" }}>
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
              </div>
              <ArrowForwardIosIcon
                className="get-started-icon"
                style={{
                  marginRight: "10px",
                  fontWeight: "400",
                  fontSize: "30px",
                  color: "#ccc",
                }}
              />
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Step3;
