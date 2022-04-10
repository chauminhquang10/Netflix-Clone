import React, { useState, useContext, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "./PackageDetail.css";
import { GlobalState } from "../../../../../GlobalState";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import swal from "sweetalert";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const initialState = {
  title: "",
  price: 0,
  video_quality: "",
  resolution: "",
  devices: [],
  sold: "",
  image:
    "https://www.macmillandictionary.com/external/slideshow/full/White_full.png",
};

const devices = ["TV", "Computer", "Tablet", "Phone"];

function getStyles(name, devices, theme) {
  return {
    fontWeight:
      devices.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelect() {
  const param = useParams();
  const state = useContext(GlobalState);
  const [packagesCallback, setPackagesCallback] =
    state.packagesAPI.packagesCallback;
  const [isAdmin] = state.usersAPI.isAdmin;
  const [token] = state.token;
  const [pack, setPack] = useState(initialState);
  const [packs] = state.packagesAPI.packages;
  const theme = useTheme();
  const history = useHistory();

  useEffect(() => {
    if (param.id) {
      packs.forEach((pack) => {
        if (pack._id === param.id) {
          setPack(pack);
        }
      });
    }
  }, [param.id, packs]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setPack({ ...pack, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert("You're not an admin");

      const res = param.id
        ? await axios.put(
            `/api/packages/${pack._id}`,
            { ...pack },
            {
              headers: {
                Authorization: token,
              },
            }
          )
        : await axios.post(
            "/api/packages",
            { ...pack },
            {
              headers: {
                Authorization: token,
              },
            }
          );
      swal({
        title: "Info !",
        text: res.data.msg,
        icon: "success",
        confirmButtonText: "Yes",
      });

      setPackagesCallback(!packagesCallback);
      history.push("/packages");
    } catch (error) {
      swal({
        title: "Info !",
        text: error.response.data.msg,
        icon: "error",
        confirmButtonText: "Yes",
      });
    }
  };

  return (
    <div className="Pack_container">
      <div>
        <div className="PackItem">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={pack.title}
            onChange={handleChangeInput}
          ></input>
        </div>
        <div className="PackItem">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            name="price"
            id="price"
            required
            value={pack.price}
            onChange={handleChangeInput}
          ></input>
        </div>
        <div className="PackItem">
          <label htmlFor="video_quality">Video Quality</label>
          <input
            type="text"
            name="video_quality"
            id="video_quality"
            required
            value={pack.video_quality}
            onChange={handleChangeInput}
          ></input>
        </div>
      </div>
      <div>
        <div className="PackItem">
          <label htmlFor="video_quality">Resolution</label>
          <input
            type="number"
            name="resolution"
            id="resolution"
            required
            value={pack.resolution}
            onChange={handleChangeInput}
          ></input>
        </div>
        <div className="PackItem_FormControl">
          <FormControl sx={{ width: 300 }}>
            <InputLabel id="demo-multiple-name-label">Device</InputLabel>
            <Select
              name="devices"
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              multiple
              value={pack.devices}
              onChange={handleChangeInput}
              input={<OutlinedInput label="Device" />}
              MenuProps={MenuProps}
            >
              {devices.map((device) => (
                <MenuItem
                  key={device}
                  value={device.toLowerCase()}
                  style={getStyles(device, pack.devices, theme)}
                >
                  {device}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="PackItem">
          <button onClick={handleSubmit} className="addPackButton">
            {param.id ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
