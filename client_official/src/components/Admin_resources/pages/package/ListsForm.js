import React from "react";
import { Grid } from "@material-ui/core";
import AdminInput from "../../Admin_resources/Admin_components/admin_input/AdminInput";
import AdminNormalButton from "../../Admin_resources/Admin_components/admin_button/AdminNormalButton";
import { makeStyles } from "@material-ui/core";

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
  const classes = useStyles();

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
        <AdminInput
          name="genre"
          label="Genre"
          value={genre}
          onChange={(e) => {
            setGenre(e.target.value);
          }}
        />
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
