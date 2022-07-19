import React, { useState, useContext } from "react";
import "./AdminLists.css";
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
import CloseIcon from "@material-ui/icons/Close";
import AdminActionButtons from "../../Admin_components/admin_button/AdminActionButtons";
import AdminNormalButton from "../../Admin_components/admin_button/AdminNormalButton";
import PopUp from "../../Admin_components/popup/ListsPopUp";
import AddIcon from "@material-ui/icons/Add";
import ListsForm from "./ListsForm";
import { TblPagination } from "../components/Controls/Utils";
import { GlobalState } from "../../../../GlobalState";
import DeleteIcon from "@material-ui/icons/Delete";
import Checkbox from "@mui/material/Checkbox";
import Swal from "sweetalert2";
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

const AdminLists = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [lists, setLists] = state.listsAPI.lists;

  //update list
  const [list, setList] = useState("");
  const [genre, setGenre] = useState("");
  const [onEdit, setOnEdit] = useState(false);
  const [id, setId] = useState("");

  //xử lí popup
  const [openPopup, setOpenPopup] = useState(false);

  const classes = useStyles();
  const [isChecked, setIsChecked] = useState(false);

  const pages = [5, 10, 25];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const [filterFunc, setFilterFunc] = useState({
    func: (lists) => {
      return lists;
    },
  });
  const handleSearch = (event) => {
    let target = event.target;
    setFilterFunc({
      func: (lists) => {
        if (target.value === "") return lists;
        else
          return lists.filter((list) =>
            list.title.toLowerCase().includes(target.value.toLowerCase())
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
      id: "title",
      label: "Title",
    },
    {
      id: "genre",
      label: "Genre",
    },
    {
      id: "actions",
      label: "Actions",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (onEdit) {
        const res = await axios.put(
          `/api/lists/${id}`,
          { title: list, genre: genre },
          {
            headers: {
              Authorization: token,
            },
          }
        );

        const newLists = lists.map((item) =>
          item._id === id ? { ...item, title: list, genre: genre } : item
        );

        setLists([...newLists]);

        Swal.fire(res.data.msg, "", "success");
      } else {
        const res = await axios.post(
          "/api/lists",
          { title: list, genre: genre },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        res.data?.createdList && setLists([...lists, res.data.createdList]);

        Swal.fire(res.data.msg, "", "success");
      }
      setOnEdit(false);
      setList("");
      setGenre("");
      setOpenPopup(false);
    } catch (error) {
      Swal.fire(error.response.data.msg, "", "error");
    }
  };

  const editList = async (id, title, genre) => {
    setId(id);
    setList(title);
    setGenre(genre);
    setOnEdit(true);
  };

  const deleteList = async (id) => {
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
          const res = await axios.delete(`/api/lists/${id}`, {
            headers: {
              Authorization: token,
            },
          });

          const newLists = lists.filter((item) => item._id !== id);
          setLists([...newLists]);

          Swal.fire(res.data.msg, "", "success");
        } catch (error) {
          alert(error.response.data.msg);
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
      filterFunc.func(lists),
      getComparator(order, orderBy)
    ).slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  };

  const deleteListForDeleteAll = async (id) => {
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
        lists.forEach(async (item) => {
          if (item.checked) {
            needDeletedItems.push(item._id);
            await deleteListForDeleteAll(item._id);
          }
        });
        // set lại state cho genres
        const newLists = lists.filter(
          (item) => !needDeletedItems.includes(item._id)
        );
        Swal.fire("Lists Deleted", "", "success");
        setLists([...newLists]);
        setIsChecked(false);
      }
    });
  };

  const handleCheck = (id) => {
    lists.forEach((item) => {
      if (item._id === id) item.checked = !item.checked;
    });
    setLists([...lists]);
  };

  const checkAll = () => {
    lists.forEach((item) => {
      item.checked = !isChecked;
    });
    setLists([...lists]);
    setIsChecked(!isChecked);
  };

  return (
    <div className="admin-lists">
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
            className={classes.newButton}
            onClick={() => {
              setOpenPopup(true);
            }}
          ></AdminNormalButton>
        </Toolbar>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "white" }} colSpan={7}>
                Lists Table
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
            {recordsAfterPagingAndSorting().map((list, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox
                    color="primary"
                    checked={list.checked}
                    onChange={() => handleCheck(list._id)}
                  />
                </TableCell>
                <TableCell>{list._id}</TableCell>
                <TableCell>
                  {list.title.replace(/\w\S*/g, (w) =>
                    w.replace(/^\w/, (c) => c.toUpperCase())
                  )}
                </TableCell>
                <TableCell>
                  {list.genre.replace(/\w\S*/g, (w) =>
                    w.replace(/^\w/, (c) => c.toUpperCase())
                  )}
                </TableCell>
                <TableCell>
                  <AdminActionButtons
                    color="primary"
                    onClick={() => {
                      editList(list._id, list.title, list.genre);
                      setOpenPopup(true);
                    }}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </AdminActionButtons>

                  <AdminActionButtons
                    color="secondary"
                    onClick={() => deleteList(list._id)}
                  >
                    <CloseIcon fontSize="small" />
                  </AdminActionButtons>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TblPagination
          records={lists}
          page={page}
          pages={pages}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        ></TblPagination>
      </Paper>
      <PopUp
        title="List Form"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        setOnEdit={setOnEdit}
        setList={setList}
        setGenre={setGenre}
      >
        <ListsForm
          onEdit={onEdit}
          handleSubmit={handleSubmit}
          list={list}
          genre={genre}
          setList={setList}
          setGenre={setGenre}
        />
      </PopUp>
    </div>
  );
};

export default AdminLists;
