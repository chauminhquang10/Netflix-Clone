import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";
import {
  showErrMessage,
  showSuccessMessage,
} from "../utils/notifications/Notification";

const initialState = {
  email: "",
  password: "",
  err: "",
  success: "",
};

const Login = () => {
  const [user, setUser] = useState(initialState);

  const { email, password, err, success } = user;

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value, err: "", success: "" });
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/user/login", { email, password });
      setUser({
        ...user,
        err: "",
        success: res.data.msg,
      });
      localStorage.setItem("firstLogin", true);
      window.location.href = "/";
    } catch (error) {
      error.response.data.msg &&
        setUser({
          ...user,
          err: error.response.data.msg,
          success: "",
        });
    }
  };

  const responseGoogle = async (response) => {
    try {
      const res = await axios.post("/user/google_login", {
        tokenId: response.tokenId,
      });
      setUser({
        ...user,
        err: "",
        success: res.data.msg,
      });
      localStorage.setItem("firstLogin", true);
      window.location.href = "/";
    } catch (error) {
      error.response.data.msg &&
        setUser({
          ...user,
          err: error.response.data.msg,
          success: "",
        });
    }
  };

  const responseFacebook = async (response) => {
    try {
      const { accessToken, userID } = response;
      const res = await axios.post("/user/facebook_login", {
        accessToken,
        userID,
      });
      setUser({
        ...user,
        err: "",
        success: res.data.msg,
      });
      localStorage.setItem("firstLogin", true);
      window.location.href = "/";
    } catch (error) {
      error.response.data.msg &&
        setUser({
          ...user,
          err: error.response.data.msg,
          success: "",
        });
    }
  };

  return (
    <div className="login_page">
      <h2>Login</h2>
      {err && showErrMessage(err)}
      {success && showSuccessMessage(success)}
      <form onSubmit={loginSubmit}>
        <input
          type="email"
          name="email"
          required
          placeholder="Your email"
          value={email}
          onChange={onChangeInput}
        ></input>
        <input
          type="password"
          name="password"
          autoComplete="on"
          required
          placeholder="Your password"
          value={password}
          onChange={onChangeInput}
        ></input>
        <div className="row">
          <button type="submit">Login</button>

          <Link to="/forgot_password">Forgot your password?</Link>
        </div>
      </form>

      <div className="hr">Or Login With</div>

      <div className="social">
        <GoogleLogin
          clientId="995505543329-q9ug4f4eqvp402h4vv16963e3pi2oro0.apps.googleusercontent.com"
          buttonText="Login with google"
          onSuccess={responseGoogle}
          cookiePolicy={"single_host_origin"}
        />

        <FacebookLogin
          appId="467718794599736"
          autoLoad={false}
          fields="name,email,picture"
          callback={responseFacebook}
        />
      </div>

      <p>
        New Member? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
