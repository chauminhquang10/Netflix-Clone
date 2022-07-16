import React, { useState, useContext } from "react";
import "./AdminActors.scss";
import {
  InputAdornment,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Toolbar,
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

const AdminActors = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;

  const [actors, setActors] = state.actorsAPI.actors;
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();

  //update actor
  const [actor, setActor] = useState("");
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
    func: (actors) => {
      return actors;
    },
  });

  // useEffect(() => {}, []);

  const handleSearch = (event) => {
    let target = event.target;
    setFilterFunc({
      func: (actors) => {
        if (target.value === "") return actors;
        else
          return actors.filter((actor) =>
            actor.name.toLowerCase().includes(target.value.toLowerCase())
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
        let needDeletedActors = [];
        await actors.forEach(async (actor) => {
          if (actor.checked) {
            needDeletedActors.push(actor._id);
            await deleteActorForDeleteAll(actor._id);
          }
        });
        // set lại state cho actors
        const newActors = actors.filter(
          (item) => !needDeletedActors.includes(item._id)
        );
        Swal.fire("Actors Deleted", "", "success");
        setActors([...newActors]);
        setIsChecked(false);
      }
    });
  };

  const handleCheck = (id) => {
    actors.forEach((actor) => {
      if (actor._id === id) actor.checked = !actor.checked;
    });
    setActors([...actors]);
  };
  const checkAll = () => {
    actors.forEach((actor) => {
      actor.checked = !isChecked;
    });
    setActors([...actors]);
    setIsChecked(!isChecked);
  };

  const editActor = async (id, name) => {
    setId(id);
    setActor(name);
    setOnEdit(true);
  };

  const deleteActor = async (id) => {
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
          let res = await axios.delete(`/api/actors/${id}`, {
            headers: {
              Authorization: token,
            },
          });
          const newActors = actors.filter((item) => item._id !== id);

          Swal.fire(res.data.msg, "", "success");
          setActors([...newActors]);
        }
      });
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const deleteActorForDeleteAll = async (id) => {
    try {
      await axios.delete(`/api/actors/${id}`, {
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
      filterFunc.func(actors),
      getComparator(order, orderBy)
    ).slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  };

  // const handleSort = (id) => {
  //   const isAsc = orderBy === id && order === "asc";
  //   setOrder(isAsc ? "desc" : "asc");
  //   setOrderBy(id);
  // };

  return (
    <div className="admin-actors">
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
          <Link to="/NewActor">
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
                Actors Table
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
            {recordsAfterPagingAndSorting().map((actor, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox
                    color="primary"
                    checked={actor.checked}
                    onChange={() => handleCheck(actor._id)}
                  />
                </TableCell>
                <TableCell>{actor._id}</TableCell>
                <TableCell>
                  {actor.name.replace(/\w\S*/g, (w) =>
                    w.replace(/^\w/, (c) => c.toUpperCase())
                  )}
                </TableCell>
                <TableCell>
                  {actor.gender.replace(/\w\S*/g, (w) =>
                    w.replace(/^\w/, (c) => c.toUpperCase())
                  )}
                </TableCell>
                <TableCell>{actor.place_of_birth}</TableCell>
                <TableCell>{actor.birthday}</TableCell>
                <TableCell>
                  <Link to={`/edit_actor/${actor._id}`}>
                    <AdminActionButtons
                      color="primary"
                      onClick={() => {
                        editActor(actor._id, actor.name);
                        setOpenPopup(true);
                      }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </AdminActionButtons>
                  </Link>

                  <AdminActionButtons
                    color="secondary"
                    onClick={() => deleteActor(actor._id)}
                  >
                    <CloseIcon fontSize="small" />
                  </AdminActionButtons>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TblPagination
          records={actors}
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

export default AdminActors;
