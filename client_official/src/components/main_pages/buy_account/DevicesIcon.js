import React from "react";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import TabletIcon from "@mui/icons-material/Tablet";
import ComputerIcon from "@mui/icons-material/Computer";
import ConnectedTvIcon from "@mui/icons-material/ConnectedTv";
import "./DevicesIcon.css";

const DevicesIcon = ({ devices }) => {
  return (
    <>
      {devices.map((device, index) => (
        <div className="step2_logo_container">
          {device === "phone" && <PhoneIphoneIcon />}
          {device === "tablet" && <TabletIcon />}
          {device === "tv" && <ComputerIcon />}
          {device === "computer" && <ConnectedTvIcon />}
          <div>{device}</div>
        </div>
      ))}
    </>
  );
};

export default DevicesIcon;
