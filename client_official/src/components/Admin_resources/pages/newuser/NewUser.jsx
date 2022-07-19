import React from "react";
import "./NewUser.css";

const NewUser = () => {
  return (
    <div className="newUser">
      <h1 className="newUserTitle">New User</h1>
      <form className="newUserForm">
        <div className="newUserItem">
          <label>Username</label>
          <input type="text" placeholder="John"></input>
        </div>
        <div className="newUserItem">
          <label>Full Name</label>
          <input type="text" placeholder="John Smith"></input>
        </div>
        <div className="newUserItem">
          <label>Email</label>
          <input type="email" placeholder="john99@gmail.com"></input>
        </div>
        <div className="newUserItem">
          <label>Password</label>
          <input type="password" placeholder="Password"></input>
        </div>
        <div className="newUserItem">
          <label>Phone</label>
          <input type="text" placeholder="0912 321 487"></input>
        </div>
        <div className="newUserItem">
          <label>Adress</label>
          <input type="text" placeholder="Ha Noi | VN"></input>
        </div>
        <div className="newUserItem">
          <label>Gender</label>
          <div className="newUserGender">
            <input type="radio" name="gender" id="male" value="male"></input>
            <label htmlFor="male">Male</label>
            <input
              type="radio"
              name="gender"
              id="female"
              value="female"
            ></input>
            <label htmlFor="female">Female</label>
            <input type="radio" name="gender" id="other" value="other"></input>
            <label htmlFor="other">Other</label>
          </div>
        </div>
        <div className="newUserItem">
          <label>Active</label>
          <select className="newUserSelect" name="active" id="active">
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <button className="newUserButton">Create</button>
      </form>
    </div>
  );
};

export default NewUser;
