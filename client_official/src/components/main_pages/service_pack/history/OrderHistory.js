import React, { useState, useContext, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./OrderHistory.css";
import { Link } from "react-router-dom";
import writeXlsxFile from "write-excel-file";

const OrderHistory = () => {
  const [movies, setMovies] = useState([]);

  const [objects1, setObjects1] = useState([]);

  const objects = [
    // Object #1
    {
      name: "John Smith",
      dateOfBirth: new Date(),
      cost: 1800,
      paid: true,
    },
    // Object #2
    {
      name: "Alice Brown",
      dateOfBirth: new Date(),
      cost: 2600,
      paid: false,
    },
  ];

  const schema = [
    // Column #1
    {
      column: "Name",
      type: String,
      value: (movie) => movie.original_title,
    },
    // // Column #2
    // {
    //   column: "Date of Birth",
    //   type: Date,
    //   format: "mm/dd/yyyy",
    //   value: (student) => student.dateOfBirth,
    // },
    // // Column #3
    // {
    //   column: "Cost",
    //   type: Number,
    //   format: "#,##0.00",
    //   value: (student) => student.cost,
    // },
    // // Column #4
    // {
    //   column: "Paid",
    //   type: Boolean,
    //   value: (student) => student.paid,
    // },
  ];

  const [term, setTerm] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rs = fetch(
      `https://api.themoviedb.org/3/movie/550?api_key=ce69864d6bf2d8c310737e66f4e7a4f3`
    )
      .then((data) => data.json())
      .then((data) => data && setMovies(data));

    await rs;

    console.log(objects1.original_title);

    // if (movies.length > 0) {
    //   movies.map((movie, index) => {
    //     writeXlsxFile(movie, {
    //       schema,
    //       fileName: "./file.xlsx",
    //     });
    //   });
    // }
  };

  const handleWrite = () => {
    console.log(objects1.original_title);

    //var myObject = JSON.parse({ objects1 });

    writeXlsxFile(objects1.toString(), {
      schema,
      fileName: "./file.xlsx",
    });
  };

  const handleChange = (event) => {
    setTerm(event.target.value);
  };

  return (
    <div className="newCom_container">
      <TextField
        value={term}
        onChange={handleChange}
        id="outlined-basic"
        label="Outlined"
        variant="outlined"
      />
      <Button onClick={handleSubmit} variant="contained">
        Search
      </Button>
      <Button onClick={handleWrite} variant="contained">
        Write
      </Button>
      <div className="newCom_results_container">
        {movies &&
          movies.map((movie, index) => (
            <Link to={`/watch/${movie.id}`}>
              <img
                className="newCom_container_img"
                src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
              ></img>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default OrderHistory;
