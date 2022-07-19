import React, { useState, useEffect } from "react";
import moment from "moment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const DiscountsStatus = ({ expireTime }) => {
  let currentDate = moment().format("YYYY-MM-DD");
  let discountExpireTime = moment(expireTime).format("YYYY-MM-DD");

  const [checkIsValidDiscount, setCheckIsValidDiscount] = useState(false);

  useEffect(() => {
    let checkDate = moment(currentDate).isBefore(discountExpireTime);
    let checkSameDate = moment(currentDate).isSame(discountExpireTime);
    if (checkDate || checkSameDate) {
      setCheckIsValidDiscount(true);
    }
  }, [currentDate, discountExpireTime]);

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

  return <div>{checkIsValidDiscount ? validStatus() : invalidStatus()}</div>;
};

export default DiscountsStatus;
