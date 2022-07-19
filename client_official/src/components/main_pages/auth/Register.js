import React, { useState } from "react";
import {
  Container,
  Base,
  Title,
  Input,
  Submit,
  Text,
  TextSmall,
  RouteLink,
} from "./styles";
import axios from "axios";
import "./Login.scss";
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
    <div
      className="footer"
      style={{
        backgroundImage: `url(https://res.cloudinary.com/minh-quang-21-kg/image/upload/v1635778140/TestMovie/footer-bg_balrrj.jpg)`,
      }}
    >
      <Container>
        <Title>Sign Up</Title>
        {err && showErrMessage(err)}
        {success && showSuccessMessage(success)}
        <Base onSubmit={registerSubmit}>
          <Input
            placeholder="Username"
            type="text"
            name="name"
            value={name}
            onChange={onChangeInput}
          />
          <Input
            placeholder="Email address"
            type="text"
            name="email"
            value={email}
            onChange={onChangeInput}
          />
          <Input
            type="password"
            placeholder="Password"
            name="password"
            autoComplete="on"
            value={password}
            onChange={onChangeInput}
          />
          <Input
            type="password"
            name="cf_password"
            autoComplete="on"
            placeholder="Confirm Password"
            value={cf_password}
            onChange={onChangeInput}
          ></Input>
          <Submit type="submit">Sign Up</Submit>
        </Base>

        <Text>
          Already a user? <RouteLink to="/login">Sign in now.</RouteLink>
        </Text>
        <TextSmall>
          This page is protected by Google reCAPTCHA to ensure you're not a bot.
          Learn more.
        </TextSmall>
      </Container>
    </div>
  );
};

export default Register;
