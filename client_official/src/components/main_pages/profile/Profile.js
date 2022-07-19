import React, { useState, useContext } from "react";
import { GlobalState } from "../../../GlobalState";
import { Link } from "react-router-dom";
import axios from "axios";
import { isLength, isMatch } from "../utils/validation/Validation";
import {
  showErrMessage,
  showSuccessMessage,
} from "../utils/notifications/Notification";

import { Check, Clear, CameraAlt, Edit, Delete } from "@material-ui/icons";
import "./Profile.css";

const initialState = {
  name: "",
  password: "",
  confirm_password: "",
  err: "",
  success: "",
};

const Profile = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [isAdmin] = state.usersAPI.isAdmin;
  const [userData] = state.usersAPI.userData;

  const [data, setData] = useState(initialState);
  const { name, password, confirm_password, err, success } = data;
  const [avatar, setAvatar] = useState(false);
  const [loading, setLoading] = useState(false);

  const [allUsers, setAllUsers] = state.usersAPI.allUsers;
  const [callback, setCallback] = state.usersAPI.callback;

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

  const handleUpdate = async () => {
    if (name || avatar) updateInfor();
    if (password) updatePassword();
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are you sure about deleting this user?")) {
        setLoading(true);
        await axios.delete(`/user/delete/${id}`, {
          headers: {
            Authorization: token,
          },
        });
        setLoading(false);
        setCallback(!callback);
      }
    } catch (error) {
      error.response.data.msg &&
        setData({ ...data, err: error.response.data.msg, success: "" });
    }
  };

  return (
    <>
      <div>
        {err && showErrMessage(err)}
        {success && showSuccessMessage(success)}
        {loading && <h3>Loading...</h3>}
      </div>

      <div className="profile_page">
        <div className="col-left">
          <h2>{isAdmin ? "Admin Profile" : "User Profile"}</h2>
          <div className="avatar">
            <img src={avatar ? avatar : userData.avatar} alt=""></img>
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

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Your new password"
              value={password}
              onChange={handleChangeInput}
            ></input>
          </div>

          <div className="form-group">
            <label htmlFor="confirm_password">Confirm New Password</label>
            <input
              type="password"
              name="confirm_password"
              id="confirm_password"
              placeholder="Confirm your password"
              value={confirm_password}
              onChange={handleChangeInput}
            ></input>
          </div>

          <div>
            <em style={{ color: "crimson" }}>
              * If you update your password here, you will not be able to login
              quickly using google and facebook.
            </em>
          </div>

          <button disabled={loading} onClick={handleUpdate}>
            Update
          </button>
        </div>
        <div className="col-right">
          <h2>{isAdmin ? "Users" : "Some Stuff"}</h2>
          <div style={{ overflowX: "auto" }}>
            <table className="customers">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Admin</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.role === 1 ? (
                        <Check className="check-icon" />
                      ) : (
                        <Clear className="clear-icon" />
                      )}
                    </td>
                    <td>
                      <Link to={`/edit_user/${user._id}`}>
                        <Edit className="edit-icon"></Edit>
                      </Link>
                      {userData._id !== user._id ? (
                        <Delete
                          className="delete-icon"
                          onClick={() => handleDelete(user._id)}
                        ></Delete>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
