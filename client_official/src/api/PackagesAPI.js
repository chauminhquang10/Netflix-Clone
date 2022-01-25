import React, { useState, useEffect } from "react";
import axios from "axios";

const PackgesAPI = () => {
  const [packages, setPackages] = useState([]);
  const [packagesCallback, setPackagesCallback] = useState(false);
  useEffect(() => {
    const getPackages = async () => {
      const res = await axios.get("/api/packages");
      setPackages(res.data);
    };
    getPackages();
  }, [packagesCallback]);
  return {
    packages: [packages, setPackages],
    packagesCallback: [packagesCallback, setPackagesCallback],
  };
};

export default PackgesAPI;
