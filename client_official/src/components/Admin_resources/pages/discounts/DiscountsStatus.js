import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const DiscountsStatus = ({ expireTime }) => {
  let currentDate = new Date().toDateString();
  let discountExpireTime = new Date(expireTime).toDateString();

  const validStatus = () => {
    return (
      <div>
        <span style={{ marginRight: "8px", fontWeight: 500 }}> Active</span>
        <CheckCircleIcon style={{ color: "green" }} />
      </div>
    );
  };

  const invalidStatus = () => {
    return (
      <div>
        <span style={{ marginRight: "8px", fontWeight: 500 }}> Expire</span>
        <CancelIcon style={{ color: "red" }} />
      </div>
    );
  };

  return (
    <div>
      {currentDate <= discountExpireTime ? validStatus() : invalidStatus()}
    </div>
  );
};

export default DiscountsStatus;
