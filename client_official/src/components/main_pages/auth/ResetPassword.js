import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  showErrMessage,
  showSuccessMessage,
} from "../utils/notifications/Notification";
import { isMatch, isLength } from "../utils/validation/Validation";

const initialState = {
  password: "",
  confirm_password: "",
  err: "",
  success: "",
};

const ResetPassword = () => {
  const [data, setData] = useState(initialState);
  const { access_token } = useParams();

  const { password, confirm_password, err, success } = data;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, err: "", success: "" });
  };

  const handleResetPassword = async () => {
    if (isLength(password))
      return setData({
        ...data,
        err: "Password must be at least 6 characters",
        success: "",
      });
    if (!isMatch(password, confirm_password))
      return setData({ ...data, err: "Password doesn't match", success: "" });
    try {
      const res = await axios.post(
        "/user/reset",
        { password },
        {
          headers: {
            Authorization: access_token,
          },
        }
      );
      return setData({ ...data, err: "", success: res.data.msg });
    } catch (error) {
      error.response.data.msg &&
        setData({ ...data, err: error.response.data.msg, success: "" });
    }
  };

  return (
    <div className="forgot_password">
      <h2>Reset Your Password?</h2>

      <div className="row">
        {err && showErrMessage(err)}
        {success && showSuccessMessage(success)}
        <label htmlFor="password">Enter your password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={handleChangeInput}
        ></input>
        <label htmlFor="confirm_password">Confirm your password</label>
        <input
          type="password"
          name="confirm_password"
          id="confirm_password"
          value={confirm_password}
          onChange={handleChangeInput}
        ></input>
        <button onClick={handleResetPassword}>Reset Password</button>
      </div>
    </div>
  );
};

export default ResetPassword;
