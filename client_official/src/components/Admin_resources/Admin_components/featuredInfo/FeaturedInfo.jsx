import React from "react";
import "./FeaturedInfo.css";

import { ArrowDownward, ArrowUpward } from "@material-ui/icons";

const FeaturedInfo = () => {
  return (
    <div className="admin-featured">
      <div className="adminFeaturedItem">
        <span className="adminFeaturedTitle">Revanue</span>
        <div className="adminFeaturedMoneyContainer">
          <span className="adminFeaturedMoney">$2,423</span>
          <span className="adminFeaturedMoneyRate">
            -12.1 <ArrowDownward className="adminFeaturedIcon adminNegative" />
          </span>
        </div>
        <span className="adminFeaturedSub">Compare to last months</span>
      </div>
      <div className="adminFeaturedItem">
        <span className="adminFeaturedTitle">Sales</span>
        <div className="adminFeaturedMoneyContainer">
          <span className="adminFeaturedMoney">$4,193</span>
          <span className="adminFeaturedMoneyRate">
            -1.1 <ArrowDownward className="adminFeaturedIcon adminNegative" />
          </span>
        </div>
        <span className="adminFeaturedSub">Compare to last months</span>
      </div>
      <div className="adminFeaturedItem">
        <span className="adminFeaturedTitle">Cost</span>
        <div className="adminFeaturedMoneyContainer">
          <span className="adminFeaturedMoney">$3.464</span>
          <span className="adminFeaturedMoneyRate">
            +9.8 <ArrowUpward className="adminFeaturedIcon " />
          </span>
        </div>
        <span className="adminFeaturedSub">Compare to last months</span>
      </div>
    </div>
  );
};

export default FeaturedInfo;
