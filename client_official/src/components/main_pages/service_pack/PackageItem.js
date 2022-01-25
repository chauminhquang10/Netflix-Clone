import React, { useState, useContext } from "react";
import { GlobalState } from "../../../GlobalState";
import { Link } from "react-router-dom";

const PackageItem = ({ pack }) => {
  const state = useContext(GlobalState);
  const addUserPackageService = state.usersAPI.addUserPackageService;

  return (
    <div className="product_card">
      <img src={pack.image.url} alt="" />

      <div className="product_box">
        <h2 title={pack.title}>{pack.title}</h2>
        <span>${pack.price}</span>
        <p>{pack.video_quality}</p>
      </div>

      <div className="row_btn">
        <Link
          id="btn_buy"
          to="/checkout"
          onClick={() => addUserPackageService(pack)}
        >
          Buy
        </Link>
      </div>
    </div>
  );
};

export default PackageItem;
