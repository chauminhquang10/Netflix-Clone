import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Review from "./Review";
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

const PaymentDetail = () => {
  const classes = useStyles();
  const state = useContext(GlobalState);
  const [adminHistory] = state.usersAPI.adminHistory;
  const [paymentDetail, setPaymentDetail] = useState([]);

  const params = useParams();

  useEffect(() => {
    if (params.id) {
      adminHistory.forEach((item) => {
        if (item._id === params.id) setPaymentDetail(item);
      });
    }
  }, [params.id, adminHistory]);

  if (paymentDetail.length === 0) return null;

  return (
    <Paper className={classes.pageContent}>
      <Review paymentDetail={paymentDetail} />
    </Paper>
  );
};

export default PaymentDetail;
