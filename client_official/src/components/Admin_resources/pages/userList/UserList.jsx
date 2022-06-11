import React, { useState, useContext } from "react";
import "./UserList.css";
import {
  InputAdornment,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Paper,
} from "@material-ui/core";
import Input from "../components/Controls/Input";
import { Search } from "@material-ui/icons";
import Swal from "sweetalert2";
import axios from "axios";
import {
  showErrMessage,
  showSuccessMessage,
} from "../../../main_pages/utils/notifications/Notification";
import { Check, Clear } from "@material-ui/icons";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";

import AdminActionButtons from "../../Admin_components/admin_button/AdminActionButtons";

import { Link } from "react-router-dom";

import { TblPagination } from "../components/Controls/Utils";

import { GlobalState } from "../../../../GlobalState";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  toolsContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignContent: "center",
    width: "100%",
    gap: "20px",
    padding: "0px",
  },
  searchInput: {
    width: "100%",
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

const UserList = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;

  const [userData] = state.usersAPI.userData;

  const [err, setErr] = useState(false);

  const classes = useStyles();

  const pages = [5, 10, 25];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const [allUsers, setAllusers] = state.usersAPI.allUsers;
  const [callback, setCallback] = state.usersAPI.callback;
  const [filterFunc, setFilterFunc] = useState({
    func: (allUsers) => {
      return allUsers;
    },
  });
  const handleSearch = (event) => {
    let target = event.target;
    setFilterFunc({
      func: (allUsers) => {
        if (target.value === "") return allUsers;
        else
          return allUsers.filter((user) =>
            user.name.toLowerCase().includes(target.value.toLowerCase())
          );
      },
    });
  };

  const headCells = [
    {
      id: "id",
      label: "ID",
      disableSorting: true,
    },
    {
      id: "name",
      label: "Name",
    },
    {
      id: "email",
      label: "Email",
    },
    {
      id: "role",
      label: "Admin",
    },
    {
      id: "actions",
      label: "Actions",
      disableSorting: true,
    },
  ];

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`/user/delete/${id}`, {
            headers: {
              Authorization: token,
            },
          });
          await res;
          Swal.fire(res.data.msg, "", "success");
          setCallback(!callback);
        } catch (error) {
          error.response.data.msg && setErr(error.response.data.msg);
        }
      }
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function tableSort(array, comparator) {
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
    return tableSort(
      filterFunc.func(allUsers),
      getComparator(order, orderBy)
    ).slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  };

  const handleSort = (id) => {
    const isAsc = orderBy === id && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(id);
  };

  return (
    <>
      <div>{err && showErrMessage(err)}</div>
      <div className="userlist">
        <Paper className={classes.pageContent}>
          <Toolbar className={classes.toolsContainer}>
            <Input
              onChange={handleSearch}
              label="Search"
              className={classes.searchInput}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search></Search>
                  </InputAdornment>
                ),
              }}
            ></Input>
          </Toolbar>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell style={{ color: "white" }} colSpan={7}>
                  Users Table
                </TableCell>
              </TableRow>
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
              {recordsAfterPagingAndSorting().map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user._id}</TableCell>
                  <TableCell>
                    {user.name.replace(/\w\S*/g, (w) =>
                      w.replace(/^\w/, (c) => c.toUpperCase())
                    )}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.role === 1 ? (
                      <Check className="check-icon" />
                    ) : (
                      <Clear className="clear-icon" />
                    )}
                  </TableCell>
                  <TableCell>
                    {userData._id !== user._id ? (
                      <>
                        <Link to={`/edit_user/${user._id}`}>
                          <AdminActionButtons color="primary">
                            <EditOutlinedIcon fontSize="small" />
                          </AdminActionButtons>
                        </Link>
                        <AdminActionButtons
                          color="secondary"
                          onClick={() => handleDelete(user._id)}
                        >
                          <CloseIcon fontSize="small" />
                        </AdminActionButtons>
                      </>
                    ) : (
                      ""
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TblPagination
            records={allUsers}
            page={page}
            pages={pages}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          ></TblPagination>
        </Paper>
      </div>
    </>
  );
};

export default UserList;
