export const GLOBALTYPES = {
  SOCKET: "SOCKET",
  NOTIFY: "NOTIFY",
};

export const EditData = (data, id, updateData) => {
  const newData = data.map((item) => (item._id === id ? updateData : item));
  return newData;
};
