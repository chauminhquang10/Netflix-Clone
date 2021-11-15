import React, { useState } from "react";
import {
  showErrMessage,
  showSuccessMessage,
} from "../utils/notifications/Notification";
import { Container, Base, Title, Input, Submit } from "./styles";
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
    // <div className="forgot_password">
    //   <h2>Forgot Your Password?</h2>

    //   <div className="row">
    //     {err && showErrMessage(err)}
    //     {success && showSuccessMessage(success)}
    //     <label htmlFor="email">Enter your email</label>
    //     <input
    //       type="email"
    //       name="email"
    //       id="email"
    //       value={email}
    //       onChange={handleChangeInput}
    //     ></input>
    //     <button onClick={handleForgotPassword}>Verify your email</button>
    //   </div>
    // </div>

    <div
      className="footer"
      style={{
        backgroundImage: `url(https://res.cloudinary.com/minh-quang-21-kg/image/upload/v1635778140/TestMovie/footer-bg_balrrj.jpg)`,
      }}
    >
      <Container style={{ minHeight: "400px" }}>
        <Title>Reset Password</Title>
        {err && showErrMessage(err)}
        {success && showSuccessMessage(success)}
        <Base onSubmit={handleForgotPassword}>
          <Input
            type="email"
            name="email"
            id="email"
            required
            placeholder="Email address"
            value={email}
            onChange={handleChangeInput}
          />

          <Submit type="submit">Verify your email</Submit>
        </Base>
      </Container>
    </div>
  );
};

export default ForgotPassword;
