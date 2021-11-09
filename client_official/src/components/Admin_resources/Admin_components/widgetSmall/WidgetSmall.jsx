import React, { useState, useEffect } from "react";
import "./WidgetSmall.css";
import axios from "axios";
import { Visibility } from "@material-ui/icons";

const WidgetSmall = () => {
  const [newUsers, setNewUsers] = useState([]);
  useEffect(() => {
    const getNewUsers = async () => {
      try {
        const res = await axios.get("/users?new=true", {
          headers: {
            token:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNjJmZWIwM2Q0NWQwMjhjNjJlMjc1NyIsImlzQWRtaW4iOnRydWUsImlhdCI6MTYzMzg4NDEzOCwiZXhwIjoxNjM0MzE2MTM4fQ.bMIgOpjcn-aPlL0nRTYct0umO8gw01kfwlQKp8WtGdE",
          },
        });
        setNewUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getNewUsers();
  }, []);
  return (
    <div className="widgetSmall">
      <span className="widgetSmallTitle">New Join Members</span>
      <ul className="widgetSmallList">
        {newUsers.map((user) => (
          <li className="widgetSmallListItem">
            <img
              src={
                user.profilePic ||
                "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
              }
              className="widgetSmallImg"
            ></img>
            <div className="widgetSmallUser">
              <span className="widgetSmallUsername">{user.username}</span>
            </div>
            <button className="widgetSmallButton">
              <Visibility className="widgetSmallIcon"></Visibility>
              Display
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WidgetSmall;
