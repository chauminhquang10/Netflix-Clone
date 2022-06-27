import React, { useState, useContext } from "react";
import { Grid } from "@material-ui/core";
import AdminInput from "../../Admin_components/admin_input/AdminInput";
import AdminNormalButton from "../../Admin_components/admin_button/AdminNormalButton";
import { makeStyles } from "@material-ui/core";
import { GlobalState } from "../../../../GlobalState";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFormControl-root": {
      zindex: "100",
      width: "80%",
      margin: theme.spacing(1),
      zIndex: "7 !important",
    },
  },
}));

export default function ListsForm({
  onEdit,
  handleSubmit,
  list,
  genre,
  setList,
  setGenre,
}) {
  const state = useContext(GlobalState);
  const classes = useStyles();
  const [genres] = state.genresAPI.genres;
  const handleChange = (event) => {
    setGenre(event.target.value);
  };
  return (
    <form className={classes.root} autoComplete="off" onSubmit={handleSubmit}>
      <Grid container>
        <AdminInput
          name="list"
          label="List"
          value={list}
          onChange={(e) => {
            setList(e.target.value);
          }}
        />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Genre</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={genre}
            label="Age"
            onChange={handleChange}
          >
            {genres.map((genre) => {
              return <MenuItem value={genre._id}>{genre.name}</MenuItem>;
            })}
          </Select>
        </FormControl>
        <div style={{ marginTop: "30px" }}>
          <AdminNormalButton type="submit" text={onEdit ? "Edit" : "Create"} />
          <AdminNormalButton
            text="Reset"
            color="default"
            onClick={() => {
              setList("");
              setGenre("");
            }}
          />
        </div>
      </Grid>
    </form>
  );
}
