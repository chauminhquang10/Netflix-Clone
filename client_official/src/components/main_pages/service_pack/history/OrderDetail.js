import React, { useContext } from "react";
import Review from "../../../Admin_resources/pages/payments/Review";
import { makeStyles, Paper } from "@material-ui/core";

import { GlobalState } from "../../../../GlobalState";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
    minWidth: "1054px",
  },
  table: {
    marginTop: theme.spacing(3),
    "& thead th": {
      fontWeight: "600",
      color: "white",
      backgroundColor: theme.palette.primary.light,
    },
    "& tbody td": {
      fontWeight: "300",
    },
    "& tbody tr:hover": {
      backgroundColor: "#fffbf2",
      cursor: "pointer",
    },
  },
}));

const PaymentDetail = ({ id, setId }) => {
  const classes = useStyles();
  const state = useContext(GlobalState);
  const [userHistory] = state.usersAPI.userHistory;

  if (!id) return null;

  return (
    <Paper className={classes.pageContent}>
      {userHistory.map((item) => {
        if (item._id === id) {
          console.log(item);
          return <Review paymentDetail={item} />;
        } else return null;
      })}
    </Paper>
  );
};

export default PaymentDetail;
