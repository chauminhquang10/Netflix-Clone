import React, { useState, useContext, useEffect } from "react";
import { GlobalState } from "../../../../GlobalState";
import "./AdminPayments.css";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Toolbar,
  makeStyles,
  Paper,
} from "@material-ui/core";
import { TblPagination } from "../userList/UserListUtils";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { Link } from "react-router-dom";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
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

const AdminPayments = () => {
  const state = useContext(GlobalState);
  const [adminHistory] = state.usersAPI.adminHistory;

  const classes = useStyles();

  const pages = [5, 10, 25];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();

  const headCells = [
    {
      id: "ID",
      label: "Payment ID",
    },
    {
      id: "date",
      label: "Date Of Purchased",
    },
    {
      id: "actions",
      label: "Actions",
      disableSorting: true,
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  const recordsAfterPagingAndSorting = () => {
    return stableSort(adminHistory, getComparator(order, orderBy)).slice(
      page * rowsPerPage,
      (page + 1) * rowsPerPage
    );
  };

  const handleSort = (id) => {
    const isAsc = orderBy === id && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(id);
  };

  return (
    <div className="admin-movies-list">
      <Paper className={classes.pageContent}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {headCells.map((item) => (
                <TableCell
                  key={item.id}
                  sortDirection={orderBy === item.id ? order : false}
                >
                  {item.disableSorting ? (
                    item.label
                  ) : (
                    <TableSortLabel
                      onClick={() => handleSort(item.id)}
                      direction={orderBy === item.id ? order : "asc"}
                      active={orderBy === item.id}
                    >
                      {item.label}
                    </TableSortLabel>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {recordsAfterPagingAndSorting().map((payment, index) => (
              <TableRow key={index}>
                <TableCell>{payment.paymentID}</TableCell>
                <TableCell>
                  {moment(new Date(payment.createdAt)).format("MMMM Do YYYY")}
                </TableCell>
                <TableCell>
                  <>
                    <Link to={`/payments/${payment._id}`}>
                      <ZoomInIcon color="primary">
                        <ZoomInIcon fontSize="small" />
                      </ZoomInIcon>
                    </Link>
                  </>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TblPagination
          records={adminHistory}
          page={page}
          pages={pages}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        ></TblPagination>
      </Paper>
    </div>
  );
};

export default AdminPayments;
