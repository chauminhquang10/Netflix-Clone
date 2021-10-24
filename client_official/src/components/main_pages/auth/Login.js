import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/user/login", { ...user });
      localStorage.setItem("firstLogin", true);
      window.location.href = "/";
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  return (
    <div className="login_page">
      <h2>Login</h2>
      <form onSubmit={loginSubmit}>
        <input
          type="email"
          name="email"
          required
          placeholder="Your email"
          value={user.email}
          onChange={onChangeInput}
        ></input>
        <input
          type="password"
          name="password"
          autoComplete="on"
          required
          placeholder="Your password"
          value={user.password}
          onChange={onChangeInput}
        ></input>
        <div className="row">
          <button type="submit">Login</button>
          <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
