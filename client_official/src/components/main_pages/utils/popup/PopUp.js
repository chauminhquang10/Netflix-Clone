import React from "react";
import "./PopUp.css";

const PopUp = (props) => {
  return props.trigger ? (
    <div className="popup">
      <div className="popup_inner">
        <button
          className="close_popup_btn"
          onClick={() => props.setTrigger(false)}
        >
          Close
        </button>
        {props.children}
      </div>
    </div>
  ) : (
    ""
  );
};

export default PopUp;
