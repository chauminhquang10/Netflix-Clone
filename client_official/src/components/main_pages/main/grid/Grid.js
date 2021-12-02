import React from "react";
import GridItem from "./GridItem";
import "./Grid.css";
import { OutlineButton } from "../../../button/Button";
import { Link } from "react-router-dom";

const Grid = ({ movies, title, index }) => {
  console.log(index);
  return (
    <div>
      <div className="grid_header">
        <span className="gridTitle">{title}</span>
        <Link to="/movies">
          <OutlineButton className="small">view more</OutlineButton>
        </Link>
      </div>
      {index % 2 == 0 ? (
        <div className="MP_First_Grid_container">
          {movies.map((movie, index) => {
            switch (index + 1) {
              case 1:
                return (
                  <div className="Grid_1">
                    <GridItem movie={movie}></GridItem>
                  </div>
                );
              case 2:
                return (
                  <div className="Grid_2">
                    <GridItem movie={movie}></GridItem>
                  </div>
                );
              case 3:
                return (
                  <div className="Grid_3">
                    <GridItem movie={movie}></GridItem>
                  </div>
                );
              case 4:
                return (
                  <div className="Grid_4">
                    <GridItem movie={movie}></GridItem>
                  </div>
                );
              case 5:
                return (
                  <div className="Grid_5">
                    <GridItem movie={movie}></GridItem>
                  </div>
                );
              case 6:
                return (
                  <div className="Grid_6">
                    <GridItem movie={movie}></GridItem>
                  </div>
                );
              case 7:
                return (
                  <div className="Grid_7">
                    <GridItem movie={movie}></GridItem>
                  </div>
                );
              case 8:
                return (
                  <div className="Grid_8">
                    <GridItem movie={movie}></GridItem>
                  </div>
                );
              case 9:
                return (
                  <div className="Grid_9">
                    <GridItem movie={movie}></GridItem>
                  </div>
                );
              case 10:
                return (
                  <div className="Grid_10">
                    <GridItem movie={movie}></GridItem>
                  </div>
                );
            }
          })}
        </div>
      ) : (
        <div className="MP_Second_Grid_container">
          {movies.map((movie, index) => {
            switch (index + 1) {
              case 1:
                return (
                  <div className="Grid_1">
                    <GridItem movie={movie}></GridItem>
                  </div>
                );
              case 2:
                return (
                  <div className="Grid_2">
                    <GridItem movie={movie}></GridItem>
                  </div>
                );
              case 3:
                return (
                  <div className="Grid_3">
                    <GridItem movie={movie}></GridItem>
                  </div>
                );
              case 4:
                return (
                  <div className="Grid_4">
                    <GridItem movie={movie}></GridItem>
                  </div>
                );
              case 5:
                return (
                  <div className="Grid_5">
                    <GridItem movie={movie}></GridItem>
                  </div>
                );
              case 6:
                return (
                  <div className="Grid_6">
                    <GridItem movie={movie}></GridItem>
                  </div>
                );
              case 7:
                return (
                  <div className="Grid_7">
                    <GridItem movie={movie}></GridItem>
                  </div>
                );
              case 8:
                return (
                  <div className="Grid_8">
                    <GridItem movie={movie}></GridItem>
                  </div>
                );
              case 9:
                return (
                  <div className="Grid_9">
                    <GridItem movie={movie}></GridItem>
                  </div>
                );
              case 10:
                return (
                  <div className="Grid_10">
                    <GridItem movie={movie}></GridItem>
                  </div>
                );
            }
          })}
        </div>
      )}
    </div>
  );
};

export default Grid;
