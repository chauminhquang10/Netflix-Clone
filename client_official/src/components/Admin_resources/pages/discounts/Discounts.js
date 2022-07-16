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
import { Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import React, { useState, useContext } from "react";

import Input from "../components/Controls/Input";

import DiscountsForm from "./DiscountsForm";

import AdminNormalButton from "../../Admin_components/admin_button/AdminNormalButton";

import PopUp from "../components/Controls/PopUp";
import ActionButton from "../components/Controls/ActionButton";
import Notification from "../components/Controls/Notification";
import ConfirmDialog from "../components/Controls/ConfirmDialog";

import CloseIcon from "@material-ui/icons/Close";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";

import DiscountsStatus from "./DiscountsStatus";

import { GlobalState } from "../../../../GlobalState";
import DeleteIcon from "@material-ui/icons/Delete";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import Swal from "sweetalert2";

const Discounts = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [isChecked, setIsChecked] = useState(false);

  const [discounts, setDiscounts] = state.discountsAPI.discounts;

  const [onEdit, setOnEdit] = useState(false);

  //chứa discount update
  const [updateDiscount, setUpdateDiscount] = useState(null);

  const [pages, setPages] = useState([5, 10, 25]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [order, setOrder] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [filterFunc, setFilterFunc] = useState({
    func: (discounts) => {
      return discounts;
    },
  });

  //Popup modal
  const [openPopUp, setOpenPopUp] = useState(false);

  //Notification
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  //Confirm Dialog
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const headCells = [
    {
      id: "index",
      label: "Index",
      disableSorting: true,
    },
    {
      id: "name",
      label: "Discount Coupon",
    },
    {
      id: "discountValue",
      label: "Discount Value",
    },
    {
      id: "expireTime",
      label: "Expire Time",
    },
    {
      id: "status",
      label: "Status",
      disableSorting: true,
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

  function tableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
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

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const handleSearch = (event) => {
    let target = event.target;
    setFilterFunc({
      func: (discounts) => {
        if (target.value === "") return discounts;
        else
          return discounts.filter((discount) =>
            discount.name.toLowerCase().includes(target.value.toLowerCase())
          );
      },
    });
  };

  const recordsAfterPagingAndSorting = () => {
    return tableSort(
      filterFunc.func(discounts),
      getComparator(order, orderBy)
    ).slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  };

  const handleSortLabel = (cellID) => {
    const isAsc = orderBy === cellID && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cellID);
  };

  const openInPopUp = (discount) => {
    setUpdateDiscount(discount);
    setOpenPopUp(true);
  };

  const onDelete = async (discountID) => {
    try {
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
          let res = await axios.delete(`/api/discount/${discountID}`, {
            headers: { Authorization: token },
          });

          //setCallback(!callback);
          Swal.fire(res.data.msg, "", "success");
          const newDiscounts = discounts.filter(
            (item) => item._id !== discountID
          );
          setDiscounts([...newDiscounts]);
        }
      });
    } catch (error) {
      alert(error.response.data.msg);
    }

    setNotify({
      isOpen: true,
      message: "Deleted Successfully!",
      type: "error",
    });
  };

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

  const deleteDiscountForDeleteAll = async (id) => {
    try {
      await axios.delete(`/api/lists/${id}`, {
        headers: {
          Authorization: token,
        },
      });
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const deleteAll = () => {
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
        let needDeletedItems = [];
        discounts.forEach(async (item) => {
          if (item.checked) {
            needDeletedItems.push(item._id);
            await deleteDiscountForDeleteAll(item._id);
          }
        });
        // set lại state cho genres
        Swal.fire("Discounts Deleted", "", "success");
        const newDiscounts = discounts.filter(
          (item) => !needDeletedItems.includes(item._id)
        );
        setDiscounts([...newDiscounts]);
        setIsChecked(false);
      }
    });
  };

  const handleCheck = (id) => {
    discounts.forEach((item) => {
      if (item._id === id) item.checked = !item.checked;
    });
    setDiscounts([...discounts]);
  };

  const checkAll = () => {
    discounts.forEach((item) => {
      item.checked = !isChecked;
    });
    setDiscounts([...discounts]);
    setIsChecked(!isChecked);
  };

  const classes = useStyles();

  return (
    <div style={{ flex: 4, padding: "20px" }}>
      {/* Discounts List */}
      <Paper className={classes.pageContent}>
        <Toolbar className={classes.toolsContainer}>
          <AdminNormalButton
            text="Delete(s)"
            variant="outlined"
            startIcon={<DeleteIcon />}
            className={classes.deleteButton}
            onClick={deleteAll}
          ></AdminNormalButton>
          <Input
            onChange={handleSearch}
            label="Search Discounts"
            className={classes.searchInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search></Search>
                </InputAdornment>
              ),
            }}
          ></Input>
          <AdminNormalButton
            text="Create"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              setOpenPopUp(true);
              setUpdateDiscount(null);
              setOnEdit(false);
            }}
          ></AdminNormalButton>
        </Toolbar>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "white" }} colSpan={7}>
                Discounts Table
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Checkbox
                  color="primary"
                  onChange={checkAll}
                  checked={isChecked}
                  inputProps={{
                    "aria-label": "select all desserts",
                  }}
                />
              </TableCell>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  sortDirection={orderBy === headCell.id ? order : false}
                  style={{ color: "#eee" }}
                >
                  {headCell.disableSorting ? (
                    headCell.label
                  ) : (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={() => {
                        handleSortLabel(headCell.id);
                      }}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {recordsAfterPagingAndSorting().map((discount, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox
                    color="primary"
                    checked={discount.checked}
                    onChange={() => handleCheck(discount._id)}
                  />
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{discount.name}</TableCell>
                <TableCell>{discount.discountValue}%</TableCell>
                <TableCell>{discount.expireTime}</TableCell>
                <TableCell>
                  <DiscountsStatus
                    expireTime={discount.expireTime}
                  ></DiscountsStatus>
                </TableCell>
                <TableCell>
                  <ActionButton
                    color="primary"
                    onClick={() => {
                      openInPopUp(discount);
                      setOnEdit(true);
                    }}
                  >
                    <EditOutlinedIcon fontSize="small"></EditOutlinedIcon>
                  </ActionButton>
                  <ActionButton
                    color="secondary"
                    onClick={() => {
                      onDelete(discount._id);
                    }}
                  >
                    <CloseIcon fontSize="small"></CloseIcon>
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={pages}
          component="div"
          count={discounts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        ></TablePagination>
      </Paper>
      <PopUp
        openPopUp={openPopUp}
        setOpenPopUp={setOpenPopUp}
        title="Discount Form"
      >
        <DiscountsForm
          openPopUp={openPopUp}
          setOpenPopUp={setOpenPopUp}
          updateDiscount={updateDiscount}
          setUpdateDiscount={setUpdateDiscount}
          notify={notify}
          setNotify={setNotify}
          //callback={callback}
          //setCallback={setCallback}
          discounts={discounts}
          setDiscounts={setDiscounts}
          onEdit={onEdit}
          setOnEdit={setOnEdit}
        ></DiscountsForm>
      </PopUp>
      <Notification notify={notify} setNotify={setNotify}></Notification>
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      ></ConfirmDialog>
    </div>
  );
};

export default Discounts;
