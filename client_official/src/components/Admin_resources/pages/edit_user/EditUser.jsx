import React, { useState, useEffect, useContext } from "react";
import { GlobalState } from "../../../../GlobalState";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import "./EditUser.css";
import {
  CalendarToday,
  LocationSearching,
  MailOutline,
  PermIdentity,
  PhoneAndroid,
  Publish,
} from "@material-ui/icons";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
const EditUser = () => {
  const { id } = useParams();
  const history = useHistory();
  const [editUser, setEditUser] = useState([]);
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [allUsers, setAllUsers] = state.usersAPI.allUsers;
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
      history.push("/users");
    }
  }, [allUsers, id, history]);

  const handleUpdate = async (e) => {
    e.preventDefault();
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
        Swal.fire(res.data.msg, "", "success");
        setSuccess(res.data.msg);
        setNumber(0);
        setCallback(!callback);
      }
    } catch (error) {
      error.response.data.msg &&
        Swal.fire(error.response.data.msg, "", "error");
    }
  };

  const handleCheck = () => {
    setSuccess(false);
    setErr(false);
    setCheckAdmin(!checkAdmin);
    setNumber(number + 1);
  };

  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Edit User</h1>
      </div>
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            <img
              className="userShowImg"
              src={editUser.avatar}
              alt="userinfo-img"
            ></img>
            <div className="userShowTopTitle">
              <span className="userShowUsername">{editUser.name}</span>
              <span className="userShowJob">Computer Scientist</span>
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">Account Details</span>
            <div className="userShowInfo">
              <PermIdentity className="userShowIcon"></PermIdentity>
              <span className="userShowInfoTitle">GCO Education</span>
            </div>
            <div className="userShowInfo">
              <CalendarToday className="userShowIcon"></CalendarToday>
              <span className="userShowInfoTitle">10/06/2000</span>
            </div>
            <span className="userShowTitle">Contact Details</span>
            <div className="userShowInfo">
              <PhoneAndroid className="userShowIcon"></PhoneAndroid>
              <span className="userShowInfoTitle">0123 721 313</span>
            </div>
            <div className="userShowInfo">
              <MailOutline className="userShowIcon"></MailOutline>
              <span className="userShowInfoTitle">{editUser.email}</span>
            </div>
            <div className="userShowInfo">
              <LocationSearching className="userShowIcon"></LocationSearching>
              <span className="userShowInfoTitle">Arizona | USA</span>
            </div>
          </div>
        </div>
        <div className="userUpdate">
          <span className="userUpdateTitle">Edit</span>
          <form className="userUpdateForm">
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Username</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editUser.name}
                  disabled
                  className="userUpdateInput"
                ></input>
              </div>
              <div className="userUpdateItem">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editUser.email}
                  disabled
                  className="userUpdateInput"
                ></input>
              </div>
              <div className="userUpdateItemCheckBox">
                <label htmlFor="isAdmin">Admin</label>
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={checkAdmin}
                  onChange={handleCheck}
                  className="userUpdateInput"
                ></input>
              </div>
            </div>
            <div className="userUpdateRight">
              <div className="userUpdateItem">
                <label>Phone</label>
                <input
                  type="text"
                  defaultValue="0123 721 313"
                  disabled
                  className="userUpdateInput"
                ></input>
              </div>
              <div className="userUpdateItem">
                <label>Address</label>
                <input
                  type="text"
                  defaultValue="Arizona | USA"
                  disabled
                  className="userUpdateInput"
                ></input>
              </div>
              <button className="userUpdateButton" onClick={handleUpdate}>
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
