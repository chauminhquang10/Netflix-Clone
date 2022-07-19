import React from "react";
import "./PopUp.scss";
import { Link } from "react-router-dom";

const PopUp = (props) => {
  return props.trigger ? (
    <div className="popup">
      <div className="section">
        <div className="container">
          <div className="topContent">
            <div className="title">REX</div>
            <div>Subscription Expired</div>
            <div>Hi Hao</div>
            <div>
              It seem that your Subscription is expied, all you have to do is
              click the button below to reactive your subscription.
            </div>
            <div>Your friend at REX.</div>
            <Link
              to="/step_1"
              className="button"
              onClick={() => props.setTrigger(false)}
            >
              Reactive your subscription
            </Link>
          </div>
          <div className="bottomContent">
            <div className="underline"></div>
            <div className="needHelp">Need help ?</div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};

export default PopUp;
