import axios from "axios";
import { useState, useEffect } from "react";

const DiscountsAPI = () => {
  const [discounts, setDiscounts] = useState([]);
  const [callback, setCallback] = useState(false);

  useEffect(() => {
    const getDiscounts = async () => {
      const res = await axios.get("/api/discounts");
      setDiscounts(res.data);
    };
    getDiscounts();
  }, [callback]);

  return {
    discounts: [discounts, setDiscounts],
    callback: [callback, setCallback],
  };
};

export default DiscountsAPI;
