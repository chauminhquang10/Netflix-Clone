import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import {
  showErrMessage,
  showSuccessMessage,
} from "../utils/notifications/Notification";
import {
  isEmail,
  isLength,
  isEmpty,
  isMatch,
} from "../utils/validation/Validation";

const initialState = {
  name: "",
  email: "",
  password: "",
  cf_password: "",
  err: "",
  success: "",
};

const Register = () => {
  const [user, setUser] = useState(initialState);

  const { name, email, password, cf_password, err, success } = user;

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value, err: "", success: "" });
  };

  const registerSubmit = async (e) => {
    e.preventDefault();
    if (isEmpty(name) || isEmpty(password))
      return setUser({
        ...user,
        err: "Please fill in all fields",
        success: "",
      });
    if (!isEmail(email))
      return setUser({
        ...user,
        err: "Invalid Email",
        success: "",
      });
    if (isLength(password))
      return setUser({
        ...user,
        err: "Password must be at least 6 characters",
        success: "",
      });
    if (!isMatch(password, cf_password))
      return setUser({
        ...user,
        err: "Password doesn't match",
        success: "",
      });
    try {
      const res = await axios.post("/user/register", { name, email, password });
      setUser({
        ...user,
        err: "",
        success: res.data.msg,
      });
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
      <h2>Register</h2>
      {err && showErrMessage(err)}
      {success && showSuccessMessage(success)}
      <form onSubmit={registerSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Username"
          value={name}
          onChange={onChangeInput}
        ></input>
        <input
          type="text"
          name="email"
          placeholder="Your email"
          value={email}
          onChange={onChangeInput}
        ></input>
        <input
          type="password"
          name="password"
          autoComplete="on"
          placeholder="Your password"
          value={password}
          onChange={onChangeInput}
        ></input>
        <input
          type="password"
          name="cf_password"
          autoComplete="on"
          placeholder="Confirm your password"
          value={cf_password}
          onChange={onChangeInput}
        ></input>
        <div className="row">
          <button type="submit">Register</button>
        </div>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
