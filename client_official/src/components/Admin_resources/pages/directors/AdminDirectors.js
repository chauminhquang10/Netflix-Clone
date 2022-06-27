import React, { useState, useEffect, useContext } from "react";
import "./AdminDirectors.css";
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
import axios from "axios";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import AdminActionButtons from "../../Admin_components/admin_button/AdminActionButtons";
import AdminNormalButton from "../../Admin_components/admin_button/AdminNormalButton";
import AddIcon from "@material-ui/icons/Add";
import PopUp from "../../Admin_components/popup/PopUp";
import { GlobalState } from "../../../../GlobalState";
import { TblPagination } from "../components/Controls/Utils";
import Swal from "sweetalert2";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";

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

const AdminDirectors = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;

  const [directors, setDirectors] = state.directorsAPI.directors;
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();

  //update director
  const [director, setDirector] = useState("");
  const [onEdit, setOnEdit] = useState(false);
  const [id, setId] = useState("");

  //xử lí popup
  const [openPopup, setOpenPopup] = useState(false);
  //xử lí delete all
  const [isChecked, setIsChecked] = useState(false);
  const classes = useStyles();

  const pages = [5, 10, 25];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterFunc, setFilterFunc] = useState({
    func: (directors) => {
      return directors;
    },
  });

  const handleSearch = (event) => {
    let target = event.target;
    setFilterFunc({
      func: (directors) => {
        if (target.value === "") return directors;
        else
          return directors.filter((director) =>
            director.name.toLowerCase().includes(target.value.toLowerCase())
          );
      },
    });
  };

  const headCells = [
    {
      id: "id",
      label: "ID",
    },
    {
      id: "name",
      label: "Name",
    },
    {
      id: "gender",
      label: "Gender",
    },
    {
      id: "place_of_birth",
      label: "Place Of Birth",
    },
    {
      id: "birthday",
      label: "Birth Day",
    },
    {
      id: "actions",
      label: "Actions",
    },
  ];

  const deleteAll = () => {
    directors.forEach((director) => {
      if (director.checked) deleteDirector(director._id);
    });
    setIsChecked(false);
  };

  const handleCheck = (id) => {
    directors.forEach((director) => {
      if (director._id === id) director.checked = !director.checked;
    });
    setDirectors([...directors]);
  };
  const checkAll = () => {
    directors.forEach((director) => {
      director.checked = !isChecked;
    });
    setDirectors([...directors]);
    setIsChecked(!isChecked);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (onEdit) {
        await axios.put(
          `/api/directors/${id}`,
          { name: director },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const newDirectors = directors.map((item) =>
          item._id === id ? { ...item, name: director } : item
        );

        setDirectors([...newDirectors]);
      } else {
        const res = await axios.post(
          "/api/directors",
          { name: director },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        res.data?.createdDirector &&
          setDirectors([...directors, res.data.createdDirector]);
      }
      setOnEdit(false);
      setDirector("");
      setOpenPopup(false);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const editDirector = async (id, name) => {
    setId(id);
    setDirector(name);
    setOnEdit(true);
  };

  const deleteDirector = async (id) => {
    try {
      await axios.delete(`/api/directors/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      const newDirectors = directors.filter((item) => item._id !== id);

      setDirectors([...newDirectors]);
    } catch (error) {
      alert(error.response.data.msg);
    }
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
      filterFunc.func(directors),
      getComparator(order, orderBy)
    ).slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  };

  const handleSort = (id) => {
    const isAsc = orderBy === id && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(id);
  };

  return (
    <div className="admin-directors">
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
          <Link to="/NewDirector">
            <AdminNormalButton
              text="Create"
              variant="outlined"
              startIcon={<AddIcon />}
            ></AdminNormalButton>
          </Link>
        </Toolbar>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "white" }} colSpan={7}>
                Directors Table
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
              {headCells.map((item) => (
                <TableCell key={item.id}>{item.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {recordsAfterPagingAndSorting().map((director, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox
                    color="primary"
                    checked={director.checked}
                    onChange={() => handleCheck(director._id)}
                  />
                </TableCell>
                <TableCell>{director._id}</TableCell>
                <TableCell>
                  {director.name.replace(/\w\S*/g, (w) =>
                    w.replace(/^\w/, (c) => c.toUpperCase())
                  )}
                </TableCell>
                <TableCell>
                  {director.gender.replace(/\w\S*/g, (w) =>
                    w.replace(/^\w/, (c) => c.toUpperCase())
                  )}
                </TableCell>
                <TableCell>{director.place_of_birth}</TableCell>
                <TableCell>{director.birthday}</TableCell>
                <TableCell>
                  <AdminActionButtons
                    color="primary"
                    onClick={() => {
                      editDirector(director._id, director.name);
                      setOpenPopup(true);
                    }}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </AdminActionButtons>

                  <AdminActionButtons
                    color="secondary"
                    onClick={() => deleteDirector(director._id)}
                  >
                    <CloseIcon fontSize="small" />
                  </AdminActionButtons>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TblPagination
          records={directors}
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

export default AdminDirectors;
