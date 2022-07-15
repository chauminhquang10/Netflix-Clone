import React, { useState, useContext } from "react";
import "./AdminGenres.css";
import {
  InputAdornment,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
import GenresForm from "./GenresForm";
import { GlobalState } from "../../../../GlobalState";
import { TblPagination } from "../components/Controls/Utils";
import Checkbox from "@mui/material/Checkbox";

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

const AdminGenres = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [genres, setGenres] = state.genresAPI.genres;
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();

  //update genre
  const [genre, setGenre] = useState("");
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
    func: (genres) => {
      return genres;
    },
  });
  const handleSearch = (event) => {
    let target = event.target;
    setFilterFunc({
      func: (genres) => {
        if (target.value === "") return genres;
        else
          return genres.filter((genre) =>
            genre.name.toLowerCase().includes(target.value.toLowerCase())
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
      label: "Genre",
    },
    {
      id: "actions",
      label: "Actions",
    },
  ];

  const deleteAll = () => {
    let needDeletedGenres = [];
    genres.forEach(async (genre) => {
      if (genre.checked) {
        needDeletedGenres.push(genre._id);
        await deleteGenreForDeleteAll(genre._id);
      }
    });
    // set lại state cho genres
    const newGenres = genres.filter(
      (item) => !needDeletedGenres.includes(item._id)
    );
    setGenres([...newGenres]);
    setIsChecked(false);
  };

  const handleCheck = (id) => {
    genres.forEach((genre) => {
      if (genre._id === id) genre.checked = !genre.checked;
    });
    setGenres([...genres]);
  };
  const checkAll = () => {
    genres.forEach((genre) => {
      genre.checked = !isChecked;
    });
    setGenres([...genres]);
    setIsChecked(!isChecked);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (onEdit) {
        await axios.put(
          `/api/genres/${id}`,
          { name: genre },
          {
            headers: {
              Authorization: token,
            },
          }
        );

        const newGenres = genres.map((item) =>
          item._id === id ? { ...item, name: genre } : item
        );

        setGenres([...newGenres]);
      } else {
        const res = await axios.post(
          "/api/genres",
          { name: genre },
          {
            headers: {
              Authorization: token,
            },
          }
        );

        res.data?.createdGenre && setGenres([...genres, res.data.createdGenre]);
      }
      setOnEdit(false);
      setGenre("");
      setOpenPopup(false);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const editGenre = async (id, name) => {
    setId(id);
    setGenre(name);
    setOnEdit(true);
  };

  const deleteGenre = async (id) => {
    try {
      await axios.delete(`/api/genres/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      const newGenres = genres.filter((item) => item._id !== id);

      setGenres([...newGenres]);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const deleteGenreForDeleteAll = async (id) => {
    try {
      await axios.delete(`/api/genres/${id}`, {
        headers: {
          Authorization: token,
        },
      });
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
      filterFunc.func(genres),
      getComparator(order, orderBy)
    ).slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  };

  // const handleSort = (id) => {
  //   const isAsc = orderBy === id && order === "asc";
  //   setOrder(isAsc ? "desc" : "asc");
  //   setOrderBy(id);
  // };

  return (
    <div className="admin-genres">
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
          <AdminNormalButton
            text="Create"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              setOpenPopup(true);
            }}
          ></AdminNormalButton>
        </Toolbar>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "white" }} colSpan={7}>
                Genres Table
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
            {recordsAfterPagingAndSorting().map((genre, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox
                    color="primary"
                    checked={genre.checked}
                    onChange={() => handleCheck(genre._id)}
                  />
                </TableCell>
                <TableCell>{genre._id}</TableCell>
                <TableCell>
                  {genre.name.replace(/\w\S*/g, (w) =>
                    w.replace(/^\w/, (c) => c.toUpperCase())
                  )}
                </TableCell>
                <TableCell>
                  <AdminActionButtons
                    color="primary"
                    onClick={() => {
                      editGenre(genre._id, genre.name);
                      setOpenPopup(true);
                    }}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </AdminActionButtons>

                  <AdminActionButtons
                    color="secondary"
                    onClick={() => deleteGenre(genre._id)}
                  >
                    <CloseIcon fontSize="small" />
                  </AdminActionButtons>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TblPagination
          records={genres}
          page={page}
          pages={pages}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        ></TblPagination>
      </Paper>
      <PopUp
        title="Genre Form"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        setOnEdit={setOnEdit}
        setGenre={setGenre}
      >
        <GenresForm
          onEdit={onEdit}
          handleSubmit={handleSubmit}
          genre={genre}
          setGenre={setGenre}
        />
      </PopUp>
    </div>
  );
};

export default AdminGenres;
