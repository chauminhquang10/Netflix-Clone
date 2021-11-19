import React, { useState, useEffect, useContext } from "react";
import { GlobalState } from "../../../GlobalState";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import "./EditUser.css";
import {
  showErrMessage,
  showSuccessMessage,
} from "../utils/notifications/Notification";

const EditUser = () => {
  const { id } = useParams();
  const history = useHistory();
  const [editUser, setEditUser] = useState([]);
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [allUsers] = state.usersAPI.allUsers;
  const [callback, setCallback] = state.usersAPI.callback;
  const [checkAdmin, setCheckAdmin] = useState(false);
  const [err, setErr] = useState(false);
  const [success, setSuccess] = useState(false);
  const [number, setNumber] = useState(0);

  useEffect(() => {
    if (allUsers.length !== 0) {
      allUsers.forEach((user) => {
        if (user._id === id) {
          setEditUser(user);
          setCheckAdmin(user.role === 1 ? true : false);
        }
      });
    } else {
      history.push("/profile");
    }
  }, [allUsers, id, history]);

  const handleUpdate = async () => {
    try {
      if (number % 2 !== 0) {
        const res = await axios.patch(
          `/user/update_role/${editUser._id}`,
          {
            role: checkAdmin ? 1 : 0,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setSuccess(res.data.msg);
        setNumber(0);
        setCallback(!callback);
      }
    } catch (error) {
      error.response.data.msg && setErr(error.response.data.msg);
    }
  };

  const handleCheck = () => {
    setSuccess(false);
    setErr(false);
    setCheckAdmin(!checkAdmin);
    setNumber(number + 1);
  };

  return (
    <div className="profile_page edit_user">
      <div className="col-left">
        <h2>Edit User</h2>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            defaultValue={editUser.name}
            disabled
          ></input>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            defaultValue={editUser.email}
            disabled
          ></input>
        </div>

        <div className="form-group">
          <input
            type="checkbox"
            id="isAdmin"
            checked={checkAdmin}
            onChange={handleCheck}
          ></input>
          <label htmlFor="isAdmin">isAdmin</label>
        </div>

        <button onClick={handleUpdate}>Update</button>
        {err && showErrMessage(err)}
        {success && showSuccessMessage(success)}
      </div>
    </div>
  );
};

export default EditUser;
