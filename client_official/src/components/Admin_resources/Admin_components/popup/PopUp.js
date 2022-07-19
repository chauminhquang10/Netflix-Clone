import {
  Dialog,
  DialogContent,
  DialogTitle,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import AdminActionButtons from "../admin_button/AdminActionButtons";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  dialogWrapper: {
    padding: theme.spacing(2),
    position: "absolute",
    top: theme.spacing(10),
  },
  dialogTitle: {
    paddingRight: "0px",
  },
}));

const PopUp = ({
  title,
  children,
  openPopup,
  setOpenPopup,
  setOnEdit,
  setGenre,
}) => {
  const classes = useStyles();
  return (
    <Dialog
      open={openPopup}
      maxWidth="md"
      classes={{ paper: classes.dialogWrapper }}
    >
      <DialogTitle className={classes.dialogTitle}>
        <div style={{ display: "flex" }}>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <AdminActionButtons
            color="secondary"
            onClick={() => {
              setOpenPopup(false);
              setOnEdit(false);
              setGenre("");
            }}
          >
            <CloseIcon></CloseIcon>
          </AdminActionButtons>
        </div>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
};

export default PopUp;
