import axios from "axios";

export const getDataAPI = async (url, token) => {
  const res = await axios.get(`/api/${url}`, {
    headers: {
      Authorization: token,
    },
  });
  return res;
};

export const postDataAPI = async (url, postData, token) => {
  const res = await axios.post(`/api/${url}`, postData, {
    headers: {
      Authorization: token,
    },
  });
  return res;
};

export const putDataAPI = async (url, putData, token) => {
  const res = await axios.put(`/api/${url}`, putData, {
    headers: {
      Authorization: token,
    },
  });
  return res;
};

export const patchDataAPI = async (url, patchData, token) => {
  const res = await axios.patch(`/api/${url}`, patchData, {
    headers: {
      Authorization: token,
    },
  });
  return res;
};

export const deleteDataAPI = async (url, token) => {
  const res = await axios.delete(`/api/${url}`, {
    headers: {
      Authorization: token,
    },
  });
  return res;
};
