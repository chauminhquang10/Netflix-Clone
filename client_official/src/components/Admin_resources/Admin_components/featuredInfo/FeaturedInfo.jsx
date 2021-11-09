import React from "react";
import "./FeaturedInfo.css";

import { ArrowDownward, ArrowUpward } from "@material-ui/icons";

const FeaturedInfo = () => {
  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">Revanue</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">$2,423</span>
          <span className="featuredMoneyRate">
            -12.1 <ArrowDownward className="featuredIcon negative" />
          </span>
        </div>
        <span className="featuredSub">Compare to last months</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Sales</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">$4,193</span>
          <span className="featuredMoneyRate">
            -1.1 <ArrowDownward className="featuredIcon negative" />
          </span>
        </div>
        <span className="featuredSub">Compare to last months</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Cost</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">$3.464</span>
          <span className="featuredMoneyRate">
            +9.8 <ArrowUpward className="featuredIcon " />
          </span>
        </div>
        <span className="featuredSub">Compare to last months</span>
      </div>
    </div>
  );
};

export default FeaturedInfo;
