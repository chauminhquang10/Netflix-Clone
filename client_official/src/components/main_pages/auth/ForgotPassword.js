import React, { useState } from "react";
import {
  showErrMessage,
  showSuccessMessage,
} from "../utils/notifications/Notification";
import axios from "axios";
import { isEmail } from "../utils/validation/Validation";
import "./ForgotPassword.css";

const initialState = {
  email: "",
  err: "",
  success: "",
};

const ForgotPassword = () => {
  const [data, setData] = useState(initialState);
  const { email, err, success } = data;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, err: "", success: "" });
  };

  const handleForgotPassword = async () => {
    if (!isEmail(email))
      return setData({ ...data, err: "Invalid email", success: "" });
    try {
      const res = await axios.post("/user/forgot", { email });
      return setData({ ...data, err: "", success: res.data.msg });
    } catch (error) {
      error.response.data.msg &&
        setData({ ...data, err: error.response.data.msg, success: "" });
    }
  };

  return (
    <div className="forgot_password">
      <h2>Forgot Your Password?</h2>

      <div className="row">
        {err && showErrMessage(err)}
        {success && showSuccessMessage(success)}
        <label htmlFor="email">Enter your email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={handleChangeInput}
        ></input>
        <button onClick={handleForgotPassword}>Verify your email</button>
      </div>
    </div>
  );
};

export default ForgotPassword;
