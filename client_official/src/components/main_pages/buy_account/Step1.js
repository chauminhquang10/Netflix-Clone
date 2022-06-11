import React from "react";
import "./Step1.css";

import CheckIcon from "@mui/icons-material/Check";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const Step1 = () => {
  return (
    <div className="step1_container">
      <div className="step1_wrapper">
        <div className="step1_top_content">
          <FontAwesomeIcon
            icon={faCheckCircle}
            style={{ color: "red", fontSize: "45px" }}
            className="step1_logo"
          />

          <div className="step1_number">
            Step <span className="step1_bold_number">1</span> of
            <span className="step1_bold_number"> 3</span>
          </div>
          <h2 className="choice_text">Choose your plan.</h2>
        </div>
        <div className="step1_bottom_content">
          <ul className="checkmark_group">
            <li className="checkmark_group_item">
              <CheckIcon style={{ color: "red", fontSize: "28px" }} />
              <p>No commitments, cancel anytime.</p>
            </li>
            <li className="checkmark_group_item">
              <CheckIcon
                style={{
                  color: "red",
                  fontSize: "28px",
                }}
              />
              <p> Everything on Rex for one low price.</p>
            </li>
            <li className="checkmark_group_item">
              <CheckIcon style={{ color: "red", fontSize: "28px" }} />
              <p>No ads and no extra fees. Ever.</p>
            </li>
          </ul>
        </div>
      </div>
      <Link to="/step_2">
        <button type="button" className="step1_next_btn">
          Next
        </button>
      </Link>
    </div>
  );
};

export default Step1;
