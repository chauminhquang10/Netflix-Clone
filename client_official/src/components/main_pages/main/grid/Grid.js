import React from "react";
import GridItem from "./GridItem";
import "./Grid.css";
import { OutlineButton } from "../../../button/Button";
import { Link } from "react-router-dom";

const Grid = ({ movies, title, index }) => {
  return (
    <div>
      <div className="grid_header">
        <span className="gridTitle">{title}</span>
        <Link to="/movies">
          <OutlineButton className="small">view more</OutlineButton>
        </Link>
      </div>
      <div
        className={
          index % 2 == 0
            ? "MP_First_Grid_container"
            : "MP_Second_Grid_container"
        }
      >
        {movies.map((movie, index2) => {
          switch (index2 + 1) {
            case 1:
              return (
                <div className={"Grid_1"}>
                  <GridItem movie={movie} isBig={true}></GridItem>
                  <div className="Grid_item_title_large">{movie.title}</div>
                  <div>
                    <img
                      className="Grid_item_HD"
                      src="https://res.cloudinary.com/minh-quang-21-kg/image/upload/v1640439030/movie/ultra-4k-hd-logo-AAA0E9BB23-seeklogo.com_ccexpress_yaag0h.png"
                    />
                  </div>
                </div>
              );
            case 2:
              return (
                <div className="Grid_2">
                  <GridItem movie={movie}></GridItem>
                  <div className="Grid_item_title">{movie.title}</div>
                </div>
              );
            case 3:
              return (
                <div className="Grid_3">
                  <GridItem movie={movie}></GridItem>
                  <div className="Grid_item_title">{movie.title}</div>
                </div>
              );
            case 4:
              return (
                <div className="Grid_4">
                  <GridItem movie={movie}></GridItem>
                  <div className="Grid_item_title">{movie.title}</div>
                </div>
              );
            case 5:
              return (
                <div className="Grid_5">
                  <GridItem movie={movie}></GridItem>
                  <div className="Grid_item_title">{movie.title}</div>
                </div>
              );
            case 6:
              return (
                <div className="Grid_6">
                  <GridItem movie={movie}></GridItem>
                  <div className="Grid_item_title">{movie.title}</div>
                </div>
              );
            case 7:
              return (
                <div className="Grid_7">
                  <GridItem movie={movie}></GridItem>
                  <div className="Grid_item_title">{movie.title}</div>
                </div>
              );
            case 8:
              return (
                <div className="Grid_8">
                  <GridItem movie={movie}></GridItem>
                  <div className="Grid_item_title">{movie.title}</div>
                </div>
              );
            case 9:
              return (
                <div className="Grid_9">
                  <GridItem movie={movie}></GridItem>
                  <div className="Grid_item_title">{movie.title}</div>
                </div>
              );
            case 10:
              return (
                <div className="Grid_10">
                  <GridItem movie={movie}></GridItem>
                  <div className="Grid_item_title">{movie.title}</div>
                </div>
              );
          }
        })}
      </div>
    </div>
  );
};

export default Grid;
