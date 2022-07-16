import React, { useState, useContext } from "react";
import { GlobalState } from "../../../../GlobalState";
import "./Packages.css";
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

const Packages = () => {
  const state = useContext(GlobalState);

  const [token] = state.token;
  const [packages, setPackages] = state.packagesAPI.packages;

  //const [packagesCallback, setPackagesCallback] =
  //state.packagesAPI.packagesCallback;

  //xử lí delete all
  const [isChecked, setIsChecked] = useState(false);

  const classes = useStyles();

  const pages = [5, 10, 25];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const [filterFunc, setFilterFunc] = useState({
    func: (packages) => {
      return packages;
    },
  });
  const handleSearch = (event) => {
    let target = event.target;
    setFilterFunc({
      func: (packages) => {
        if (target.value === "") return packages;
        else
          return packages.filter((pack) =>
            pack.title.toLowerCase().includes(target.value.toLowerCase())
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
      id: "price",
      label: "Price",
    },
    {
      id: "video_quality",
      label: "Video quality",
    },
    {
      id: "resolution",
      label: "Resolution",
    },
    {
      id: "sold",
      label: "Sold",
    },
    {
      id: "actions",
      label: "Actions",
      disableSorting: true,
    },
  ];

  const handleCheck = (id) => {
    packages.forEach((pack) => {
      if (pack._id === id) pack.checked = !pack.checked;
    });
    setPackages([...packages]);
  };

  const deletePackage = async (id, public_id) => {
    try {
      let res = await axios.delete(`/api/packages/${id}`, {
        headers: {
          Authorization: token,
        },
      });

      const newPackages = packages.filter((item) => item._id !== id);

      Swal.fire(res.data.msg, "", "success");
      setPackages([...newPackages]);

      //setPackagesCallback(!packagesCallback);
    } catch (error) {
      Swal.fire(error.response.data.msg, "", "success");
    }
  };

  const deletePackageForDeleteAll = async (id, public_id) => {
    try {
      await axios.delete(`/api/packages/${id}`, {
        headers: {
          Authorization: token,
        },
      });
    } catch (error) {
      Swal.fire(error.response.data.msg, "", "success");
    }
  };

  const deleteAPackage = async (id, public_id) => {
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
        await deletePackage(id);
      }
    });
  };

  const checkAll = () => {
    packages.forEach((pack) => {
      pack.checked = !isChecked;
    });
    setPackages([...packages]);
    setIsChecked(!isChecked);
  };

  const deleteAll = async () => {
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
        let needDeletedPackages = [];

        packages.forEach(async (pack) => {
          if (pack.checked) {
            needDeletedPackages.push(pack._id);
            await deletePackageForDeleteAll(pack._id);
          }
        });

        // set lại state cho movies
        const newPackages = packages.filter(
          (item) => !needDeletedPackages.includes(item._id)
        );
        setPackages([...newPackages]);

        Swal.fire("Packages Deleted", "", "success");
        setIsChecked(false);
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
      filterFunc.func(packages),
      getComparator(order, orderBy)
    ).slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  };

  const handleSort = (id) => {
    const isAsc = orderBy === id && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(id);
  };

  console.log({ packages });

  return (
    <div className="admin-list-container">
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
          <Link to="/createpackage">
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
                Packages Table
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
            {recordsAfterPagingAndSorting().map((pack, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox
                    color="primary"
                    checked={pack.checked}
                    onChange={() => handleCheck(pack._id)}
                  />
                </TableCell>
                <TableCell>
                  {pack.title.replace(/\w\S*/g, (w) =>
                    w.replace(/^\w/, (c) => c.toUpperCase())
                  )}
                </TableCell>
                <TableCell>{pack.price}</TableCell>
                <TableCell>{pack.video_quality}</TableCell>
                <TableCell>{pack.resolution}</TableCell>
                <TableCell>{pack.sold}</TableCell>
                <TableCell>
                  <>
                    <Link to={`/packagesdetail/${pack._id}`}>
                      <AdminActionButtons color="primary">
                        <EditOutlinedIcon fontSize="small" />
                      </AdminActionButtons>
                    </Link>
                    <AdminActionButtons
                      color="secondary"
                      onClick={() => deleteAPackage(pack._id)}
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
          records={packages}
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

export default Packages;
