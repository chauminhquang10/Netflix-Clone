import React, { useState, useContext } from "react";
import { GlobalState } from "../../../../GlobalState";
import "./MovieList.css";
import axios from "axios";
import {
  InputAdornment,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Toolbar,
  Paper,
} from "@material-ui/core";
import Input from "../components/Controls/Input";
import { Search } from "@material-ui/icons";
import { TblPagination } from "../components/Controls/Utils";
import DeleteIcon from "@material-ui/icons/Delete";
import AdminNormalButton from "../../Admin_components/admin_button/AdminNormalButton";
import AdminActionButtons from "../../Admin_components/admin_button/AdminActionButtons";
import Checkbox from "@mui/material/Checkbox";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { removeNotify } from "../../../../redux/actions/notifyAction";

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

const MovieList = () => {
  const state = useContext(GlobalState);

  const [token] = state.token;
  const [movies, setMovies] = state.moviesAPI.movies;
  //const [moviesCallback, setMoviesCallback] = state.moviesAPI.moviesCallback;

  const { socket } = useSelector((state) => state);
  const dispatch = useDispatch();

  //xử lí delete all
  const [isChecked, setIsChecked] = useState(false);

  const classes = useStyles();

  const pages = [5, 10, 25];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();

  const [filterFunc, setFilterFunc] = useState({
    func: (movies) => {
      return movies;
    },
  });
  const handleSearch = (event) => {
    let target = event.target;
    setFilterFunc({
      func: (movies) => {
        if (target.value === "") return movies;
        else
          return movies.filter((movie) =>
            movie.title.toLowerCase().includes(target.value.toLowerCase())
          );
      },
    });
  };

  const headCells = [
    {
      id: "title",
      label: "Title",
    },
    {
      id: "year",
      label: "Year",
    },
    {
      id: "duration",
      label: "Duration",
    },
    {
      id: "limitAge",
      label: "Limit Age",
    },
    {
      id: "TMDBid",
      label: "The Movie DB id",
    },
    {
      id: "actions",
      label: "Actions",
      disableSorting: true,
    },
  ];

  const handleCheck = (id) => {
    movies.forEach((movie) => {
      if (movie._id === id) movie.checked = !movie.checked;
    });
    setMovies([...movies]);
    // movies.forEach((movie) => {
    //   if (movie.checked) console.log(`checked Here ${movie._id}`);
    // });
  };

  const deleteMovie = async (id, public_id, isMulti) => {
    if (!isMulti) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed || isMulti) {
          try {
            if (public_id) {
              const deleteImg = axios.post(
                "/api/delete",
                { public_id },
                {
                  headers: {
                    Authorization: token,
                  },
                }
              );
              await deleteImg;
            }
            const res = await axios.delete(`/api/movies/${id}`, {
              headers: {
                Authorization: token,
              },
            });

            Swal.fire(res.data.msg, "", "success");
            //Notify
            const msg = {
              id,
              url: `/detail/${id}`,
            };

            dispatch(removeNotify({ msg, socket, token }));

            const newMovies = movies.filter((item) => item._id !== id);
            setMovies([...newMovies]);

            //setMoviesCallback(!moviesCallback);
          } catch (error) {
            alert(error.response.data.msg);
          }
        }
      });
    } else {
      try {
        if (public_id) {
          const deleteImg = axios.post(
            "/api/delete",
            { public_id },
            {
              headers: {
                Authorization: token,
              },
            }
          );
          await deleteImg;
        }
        const res = await axios.delete(`/api/movies/${id}`, {
          headers: {
            Authorization: token,
          },
        });

        Swal.fire(res.data.msg, "", "success");
        const msg = {
          id,
          url: `/detail/${id}`,
        };
        dispatch(removeNotify({ msg, socket, token }));

        const newMovies = movies.filter((item) => item._id !== id);
        setMovies([...newMovies]);

        // setMoviesCallback(!moviesCallback);
      } catch (error) {
        alert(error.response.data.msg);
      }
    }
  };

  const deleteMovieForDeleteAll = async (id, public_id, isMulti) => {
    if (!isMulti) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed || isMulti) {
          try {
            if (public_id) {
              const deleteImg = axios.post(
                "/api/delete",
                { public_id },
                {
                  headers: {
                    Authorization: token,
                  },
                }
              );
              await deleteImg;
            }
            const res = await axios.delete(`/api/movies/${id}`, {
              headers: {
                Authorization: token,
              },
            });

            Swal.fire(res.data.msg, "", "success");
            //Notify
            const msg = {
              id,
              url: `/detail/${id}`,
            };

            dispatch(removeNotify({ msg, socket, token }));
          } catch (error) {
            alert(error.response.data.msg);
          }
        }
      });
    } else {
      try {
        if (public_id) {
          const deleteImg = axios.post(
            "/api/delete",
            { public_id },
            {
              headers: {
                Authorization: token,
              },
            }
          );
          await deleteImg;
        }
        const res = await axios.delete(`/api/movies/${id}`, {
          headers: {
            Authorization: token,
          },
        });
        // await res;
        const msg = {
          id,
          url: `/detail/${id}`,
        };
        dispatch(removeNotify({ msg, socket, token }));
      } catch (error) {
        alert(error.response.data.msg);
      }
    }
  };

  const checkAll = () => {
    movies.forEach((movie) => {
      movie.checked = !isChecked;
    });
    setMovies([...movies]);
    setIsChecked(!isChecked);
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
        // lưu mảng để xóa các phim ra khỏi state
        let needDeletedMovies = [];

        await movies.forEach(async (movie) => {
          if (movie.checked) {
            needDeletedMovies.push(movie._id);
            await deleteMovieForDeleteAll(movie._id, movie.img.public_id, true);
          }
        });
        // set lại state cho movies
        Swal.fire("Movies Deleted", "", "success");
        setIsChecked(false);
        const newMovies = movies.filter(
          (item) => !needDeletedMovies.includes(item._id)
        );
        setMovies([...newMovies]);
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
      filterFunc.func(movies),
      getComparator(order, orderBy)
    ).slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  };

  const handleSort = (id) => {
    const isAsc = orderBy === id && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(id);
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
          <Link to="/newMovie">
            <AdminNormalButton
              text="Create"
              variant="outlined"
              startIcon={<AddIcon />}
              className={classes.AddButton}
            ></AdminNormalButton>
          </Link>
        </Toolbar>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "white" }} colSpan={7}>
                Movies Table
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Checkbox
                  color="primary"
                  // indeterminate={numSelected > 0 && numSelected < rowCount}
                  // checked={rowCount > 0 && numSelected === rowCount}
                  onChange={checkAll}
                  checked={isChecked}
                  inputProps={{
                    "aria-label": "select all desserts",
                  }}
                />
              </TableCell>
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
            {recordsAfterPagingAndSorting().map((movie, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox
                    color="primary"
                    checked={movie.checked}
                    onChange={() => handleCheck(movie._id)}
                  />
                </TableCell>
                <TableCell>
                  {movie.title.replace(/\w\S*/g, (w) =>
                    w.replace(/^\w/, (c) => c.toUpperCase())
                  )}
                </TableCell>
                <TableCell>{movie.year}</TableCell>
                <TableCell>{movie.duration}</TableCell>
                <TableCell>{movie.limitAge}</TableCell>
                <TableCell>{movie.TMDBid}</TableCell>
                <TableCell>
                  <>
                    <Link to={`/edit_movie/${movie._id}`}>
                      <AdminActionButtons color="primary">
                        <EditOutlinedIcon fontSize="small" />
                      </AdminActionButtons>
                    </Link>
                    <AdminActionButtons
                      color="secondary"
                      onClick={() =>
                        deleteMovie(movie._id, movie.img.public_id)
                      }
                    >
                      <CloseIcon fontSize="small" />
                    </AdminActionButtons>
                  </>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TblPagination
          records={movies}
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

export default MovieList;
