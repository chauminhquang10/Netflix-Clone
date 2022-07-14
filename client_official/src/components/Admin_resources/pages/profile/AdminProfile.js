import React, { useState, useContext } from "react";
import { CameraAlt } from "@material-ui/icons";
import { GlobalState } from "../../../../GlobalState";
import axios from "axios";
import {
  isLength,
  isMatch,
} from "../../../main_pages/utils/validation/Validation";
import {
  showErrMessage,
  showSuccessMessage,
} from "../../../main_pages/utils/notifications/Notification";
import { TextField } from "@material-ui/core";

import "./AdminProfile.css";

const initialState = {
  name: "",
  password: "",
  confirm_password: "",
  err: "",
  success: "",
};

const AdminProfile = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [isAdmin] = state.usersAPI.isAdmin;
  const [userData] = state.usersAPI.userData;

  const [data, setData] = useState(initialState);
  const { name, password, confirm_password, err, success } = data;
  const [avatar, setAvatar] = useState(false);
  const [loading, setLoading] = useState(false);

  const [allUsers, setAllUsers] = state.usersAPI.allUsers;
  // const [callback, setCallback] = state.usersAPI.callback;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, err: "", success: "" });
  };

  const handleChangeAvatar = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      if (!file)
        return setData({ ...data, err: "No file was chosen", success: "" });
      if (file.size > 1024 * 1024) {
        return setData({ ...data, err: "Size too large", success: "" });
      }

      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        return setData({
          ...data,
          err: "File format is incorrect",
          success: "",
        });
      }

      let formData = new FormData();
      formData.append("file", file);

      setLoading(true);
      const res = await axios.post("/api/upload_avatar", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });

      setLoading(false);
      setAvatar(res.data.url);
    } catch (error) {
      error.response.data.msg &&
        setData({ ...data, err: error.response.data.msg, success: "" });
    }
  };

  const updateInfor = () => {
    try {
      axios.patch(
        "/user/update",
        {
          name: name ? name : userData.name,
          avatar: avatar ? avatar : userData.avatar,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setData({ ...data, err: "", success: "Updated Success!" });
      window.location.reload();
    } catch (error) {
      error.response.data.msg &&
        setData({
          ...data,
          err: error.response.data.msg,
          success: "Updated Success!",
        });
    }
  };
  const updatePassword = () => {
    if (isLength(password)) {
      return setData({
        ...data,
        err: "Password must be at least 6 characters",
        success: "",
      });
    }
    if (!isMatch(password, confirm_password)) {
      return setData({ ...data, err: "Password doesn't match", success: "" });
    }
    try {
      axios.post(
        "/user/reset",
        {
          password,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setData({
        ...data,
        password: "",
        confirm_password: "",
        err: "",
        success: "Updated Success!",
      });
    } catch (error) {
      error.response.data.msg &&
        setData({ ...data, err: error.response.data.msg, success: "" });
    }
  };

  const handleUpdateInfo = async () => {
    if (name || avatar) updateInfor();
  };

  const handleUpdatePassword = async () => {
    if (password) updatePassword();
  };

  return (
    <>
      <div>
        {err && showErrMessage(err)}
        {success && showSuccessMessage(success)}
        {loading && <h3>Loading...</h3>}
      </div>
      <div className="admin-profile">
        <div className="photo-container">
          <h2 className="photo-title">Profile Photo</h2>

          <div className="detail-photo">
            <div className="avatar">
              <img
                className="AD_img"
                src={avatar ? avatar : userData.avatar}
                alt=""
              ></img>
              <span>
                <CameraAlt></CameraAlt>
                <p>Change</p>
                <input
                  type="file"
                  name="file"
                  id="file_up"
                  onChange={handleChangeAvatar}
                ></input>
              </span>
            </div>
            <div className="detail-photo-info">
              <h3 className="photo-title">Upload your photo...</h3>
              <p style={{ color: "#333" }}>
                Photo should be at least 300px × 300px
              </p>
            </div>
          </div>
        </div>
        <div className="profile-info">
          <div className="basic-info">
            <h2 className="photo-title">Basic Information</h2>
            <div className="profile-inputs">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Your name"
                  defaultValue={userData.name}
                  onChange={handleChangeInput}
                ></input>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Your email"
                  defaultValue={userData.email}
                  disabled
                ></input>
              </div>
            </div>

            <button
              className="profile-btn"
              disabled={loading}
              onClick={handleUpdateInfo}
            >
              Update
            </button>
          </div>
          <div className="change-password">
            <h2 className="photo-title">Change password</h2>

            <div className="profile-inputs">
              <TextField
                id="outlined-basic"
                label="New Password"
                name="password"
                variant="outlined"
                type="password"
                value={password}
                onChange={handleChangeInput}
                style={{ width: "50%", marginTop: "30px" }}
              />
              <TextField
                id="outlined-basic"
                name="confirm_password"
                label="Confirm Password"
                variant="outlined"
                type="password"
                value={confirm_password}
                onChange={handleChangeInput}
                style={{ width: "50%", marginTop: "40px" }}
              />
            </div>

            <div style={{ marginTop: "20px", width: "70%" }}>
              <em style={{ color: "crimson", fontSize: "14px" }}>
                * If you update your password here, you won't be able to login
                quickly using social media.
              </em>
            </div>
            <button className="profile-btn" onClick={handleUpdatePassword}>
              Update
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProfile;
