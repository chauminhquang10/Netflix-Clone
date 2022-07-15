import { useState, useEffect } from "react";
import axios from "axios";

const ListsAPI = () => {
  const [lists, setLists] = useState([]);
  const [listsCallback, setListsCallback] = useState(false);
  useEffect(() => {
    const getLists = async () => {
      const res = await axios.get("/api/lists");
      setLists(res.data);
    };
    getLists();
  }, [listsCallback]);
  return {
    lists: [lists, setLists],
    listsCallback: [listsCallback, setListsCallback],
  };
};

export default ListsAPI;
