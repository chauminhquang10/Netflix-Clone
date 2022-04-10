import React, { useState, useEffect, useContext } from "react";
import "./AdminGenres.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@material-ui/core";
import { Paper, makeStyles, Toolbar } from "@material-ui/core";
import axios from "axios";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import AdminActionButtons from "../../Admin_resources/Admin_components/admin_button/AdminActionButtons";
import AdminNormalButton from "../../Admin_resources/Admin_components/admin_button/AdminNormalButton";
import PopUp from "../../Admin_resources/Admin_components/popup/PopUp";
import AddIcon from "@material-ui/icons/Add";
import GenresForm from "./GenresForm";
import { TblPagination } from "../../Admin_resources/pages/userList/UserListUtils";
import { GlobalState } from "../../../GlobalState";
import Swal from "sweetalert2";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  newButton: {
    position: "absolute",
    right: "10px",
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
  const [genres] = state.genresAPI.genres;

  const [genresCallback, setGenresCallback] = state.genresAPI.genresCallback;
  //update genre
  const [genre, setGenre] = useState("");
  const [onEdit, setOnEdit] = useState(false);
  const [id, setId] = useState("");

  //xử lí popup
  const [openPopup, setOpenPopup] = useState(false);

  const classes = useStyles();

  const pages = [5, 10, 25];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (onEdit) {
        const res = await axios.put(
          `/api/genres/${id}`,
          { name: genre },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        Swal.fire(res.data.msg, "", "success");
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
        Swal.fire(res.data.msg, "", "success");
      }
      setOnEdit(false);
      setGenre("");
      setGenresCallback(!genresCallback);
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
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      try {
        const res = await axios.delete(`/api/genres/${id}`, {
          headers: {
            Authorization: token,
          },
        });
        Swal.fire(res.data.msg, "", "success");
        setGenresCallback(!genresCallback);
      } catch (error) {
        alert(error.response.data.msg);
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

  return (
    <div className="admin-genres">
      <Paper className={classes.pageContent}>
        <Toolbar>
          <AdminNormalButton
            text="Add New"
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
              {headCells.map((item) => (
                <TableCell key={item.id}>{item.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {genres.map((genre, index) => (
              <TableRow key={index}>
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
