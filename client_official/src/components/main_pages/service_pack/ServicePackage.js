import React, { useContext, useState } from "react";
import "./ServicePackage.css";
import { GlobalState } from "../../../GlobalState";
import PackageItem from "./PackageItem";

const ServicePackage = () => {
  const state = useContext(GlobalState);
  const [packages, setPackages] = state.packagesAPI.packages;
  return (
    <div className="products">
      {packages.map((pack) => {
        return <PackageItem key={pack._id} pack={pack} />;
      })}
    </div>
  );
};

export default ServicePackage;
