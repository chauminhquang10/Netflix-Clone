import React from "react";
import "./Notification.css";

export const showErrMessage = (msg) => {
  return <div className="errMessage">{msg}</div>;
};

export const showSuccessMessage = (msg) => {
  return <div className="successMessage">{msg}</div>;
};
