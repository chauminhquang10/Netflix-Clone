import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { GlobalState } from "../../../../GlobalState";
import PuffLoader from "react-spinners/PuffLoader";
import "./EditMovie.css";
import { Link, useHistory, useParams } from "react-router-dom";
import Chart from "../../Admin_components/chart/Chart";
import { productData } from "../../Admin_components/dummyData";
import { Publish } from "@material-ui/icons";
import { useTheme } from "@mui/material/styles";
import {
  FormControl,
  Select,
  MenuItem,
  OutlinedInput,
} from "@material-ui/core";
import Swal from "sweetalert2";

const initialState = {
  title: "",
  desc: "Movie decscription",
  year: 0,
  limitAge: 0,
  duration: 0,
  allGenres: [],
  actorsBelongTo: [],
  directorsBelongTo: [],
  trailer: "",
  TMDBid: "",
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, devices, theme) {
  return {
    fontWeight:
      devices.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const EditMovie = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [isAdmin] = state.usersAPI.isAdmin;
  const [movie, setMovie] = useState(initialState);
  const [movies, setMovies] = state.moviesAPI.movies;
  const [genres] = state.genresAPI.genres;
  const [actors] = state.actorsAPI.actors;
  const [directors] = state.directorsAPI.directors;
  const [img, setImg] = useState(false);
  const [imgSmall, setImgSmall] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const param = useParams();
  //const [moviesCallback, setMoviesCallback] = state.moviesAPI.moviesCallback;
  const theme = useTheme();
  //hiển thị thể loại của phim
  const [movieGenre, setMovieGenre] = useState([]);
  var Genres = [];
  var Actors = [];
  var Directors = [];

  useEffect(() => {
    if (param.id) {
      movies.forEach((movie) => {
        if (movie._id === param.id) {
          setMovie(movie);
          setImg(movie.img);
          if (movie.imgSmall) setImgSmall(movie.imgSmall);
        }
      });
    }
  }, [param.id, movies]);

  useEffect(() => {
    if (movie.allGenres.length > 0) {
      for (let i = 0; i < movie.allGenres.length; i++) {
        if (movie.allGenres[i].name) Genres.push(movie.allGenres[i].name);
      }
      if (Genres.length > 0) setMovie({ ...movie, ["allGenres"]: Genres });
    }
  }, [movie, genres]);

  useEffect(() => {
    if (movie.actorsBelongTo.length > 0) {
      for (let i = 0; i < movie.actorsBelongTo.length; i++) {
        for (let j = 0; j < actors.length; j++) {
          if (actors[j]._id == movie.actorsBelongTo[i]) {
            Actors.push(actors[j].name.toLowerCase());
            break;
          }
        }
      }
      if (Actors.length > 0) setMovie({ ...movie, ["actorsBelongTo"]: Actors });
    }
  }, [movie, actors]);

  useEffect(() => {
    if (movie.directorsBelongTo.length > 0) {
      for (let i = 0; i < movie.directorsBelongTo.length; i++) {
        for (let j = 0; j < directors.length; j++) {
          if (directors[j]._id == movie.directorsBelongTo[i]) {
            Directors.push(directors[j].name.toLowerCase());
            break;
          }
        }
      }
      if (Directors.length > 0)
        setMovie({ ...movie, ["directorsBelongTo"]: Directors });
    }
  }, [movie, directors]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert("You're not an admin");
      const file = e.target.files[0];

      if (!file) return alert("File not exist");

      if (file.size > 4024 * 4024) return alert("Size too large");

      if (file.type !== "image/png" && file.type !== "image/jpeg")
        return alert("File format is incorrect");

      let formData = new FormData();
      formData.append("file", file);

      setLoading(true);

      const res = await axios.post("/api/upload", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });
      setLoading(false);
      setImg(res.data.url);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const handleUploadSmall = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert("You're not an admin");
      const file = e.target.files[0];

      if (!file) return alert("File not exist");

      if (file.size > 2000 * 2000) return alert("Size too large");

      if (file.type !== "image/png" && file.type !== "image/jpeg")
        return alert("File format is incorrect");

      let formData = new FormData();
      formData.append("file", file);

      setLoading(true);

      const res = await axios.post("/api/uploadSmall", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });
      setLoading(false);
      setImgSmall(res.data.url);
      console.log("Uploaded 2");
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setMovie({ ...movie, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert("You're not an admin");
      if (!img) return alert("No image upload");

      let tempGenres = [];
      for (let i = 0; i < movie.allGenres.length; i++) {
        let rs = genres.find(
          (el) => el.name.toLowerCase() == movie.allGenres[i].toLowerCase()
        );
        if (rs) tempGenres.push(rs._id);
      }

      let tempActors = [];
      for (let i = 0; i < movie.actorsBelongTo.length; i++) {
        let rs = actors.find(
          (el) => el.name.toLowerCase() == movie.actorsBelongTo[i].toLowerCase()
        );
        if (rs) tempActors.push(rs._id);
      }

      let tempDirectors = [];
      for (let i = 0; i < movie.directorsBelongTo.length; i++) {
        let rs = directors.find(
          (el) =>
            el.name.toLowerCase() == movie.directorsBelongTo[i].toLowerCase()
        );
        tempDirectors.push(rs._id);
      }

      const res = await axios.put(
        `/api/movies/${movie._id}`,
        {
          ...movie,
          img,
          imgSmall,
          allGenres: tempGenres,
          actorsBelongTo: tempActors,
          directorsBelongTo: tempDirectors,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      Swal.fire(res.data.msg, "", "success");

      const newMovies = movies.map((item) =>
        item._id === movie._id
          ? {
              ...movie,
              img,
              imgSmall,
              allGenres: tempGenres,
              actorsBelongTo: tempActors,
              directorsBelongTo: tempDirectors,
            }
          : item
      );

      setMovies([...newMovies]);

      //setMoviesCallback(!moviesCallback);
      history.push("/movies");
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  return (
    <div className="movie">
      <div className="movieTitleContainer"></div>
      <div className="movieTop">
        <div className="movieTopLeft">
          <Chart
            data={productData}
            dataKey="Sales"
            title="Views Performance"
          ></Chart>
        </div>
      </div>
      <form className="addMovieForm" onSubmit={handleSubmit}>
        <div className="movieBottom">
          <div className="child_container">
            <div class="file-upload">
              <label className="Addmovie-label">BackDrop</label>
              {img ? (
                <div class="file-upload-content">
                  <img class="file-upload-image" src={img} alt="your image" />
                  <div class="image-title-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setImg(false);
                      }}
                      class="remove-image"
                    >
                      Remove <span class="image-title">Back Drop</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div class="image-upload-wrap">
                  <input
                    class="file-upload-input"
                    type="file"
                    id="file"
                    onChange={handleUpload}
                  />
                  <div class="drag-text">
                    <h5>Drag and drop a file or select add Back Drop</h5>
                  </div>
                </div>
              )}
            </div>
            <div class="file-upload">
              <label className="Addmovie-label">Poster</label>
              {imgSmall ? (
                <div class="file-upload-content">
                  <img
                    class="file-upload-image"
                    src={imgSmall}
                    alt="your image"
                  />
                  <div class="image-title-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setImgSmall(false);
                      }}
                      class="remove-image"
                    >
                      Remove <span class="image-title">Poster</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div class="image-upload-wrap">
                  <input
                    class="file-upload-input"
                    type="file"
                    id="fileSmall"
                    onChange={handleUploadSmall}
                  />
                  <div class="drag-text">
                    <h5>Drag and drop a file or select add Poster</h5>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="child_container">
            <div className="addMovieItem">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={movie.title}
                onChange={handleChangeInput}
              ></input>
            </div>
            <div className="addMovieItem">
              <label htmlFor="year">Year</label>
              <input
                type="number"
                name="year"
                id="year"
                required
                value={movie.year}
                onChange={handleChangeInput}
              ></input>
            </div>
            <div className="addMovieItem">
              <label htmlFor="TMDBid">The Movie DB id</label>
              <input
                type="text"
                name="TMDBid"
                id="TMDBid"
                required
                value={movie.TMDBid}
                onChange={handleChangeInput}
              ></input>
            </div>
            <div className="addMovieItem">
              <label htmlFor="TMDBid">Trailer link</label>
              <input
                type="text"
                name="trailer"
                id="trailer"
                required
                value={movie.trailer}
                onChange={handleChangeInput}
              ></input>
            </div>
            <div className="addMovieItem">
              <label htmlFor="desc">Description</label>
              <textarea
                type="text"
                name="desc"
                id="desc"
                required
                value={movie.desc}
                rows={5}
                onChange={handleChangeInput}
              ></textarea>
            </div>
          </div>
          <div className="child_container">
            <div className="addMovieItem">
              <label htmlFor="duration">Duration</label>
              <input
                type="number"
                name="duration"
                id="duration"
                required
                value={movie.duration}
                onChange={handleChangeInput}
              ></input>
            </div>
            <div className="addMovieItem">
              <label htmlFor="limitAge">Limit Age</label>
              <input
                type="number"
                name="limitAge"
                id="limitAge"
                required
                value={movie.limitAge}
                onChange={handleChangeInput}
              ></input>
            </div>
            <div className="addMovieItem hideLegend">
              <label htmlFor="duration">Genres</label>
              <Select
                name="allGenres"
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={movie.allGenres}
                input={<OutlinedInput label="Genres" />}
                MenuProps={MenuProps}
                onChange={handleChangeInput}
              >
                {genres.map((genre) => (
                  <MenuItem
                    key={genre._id}
                    value={genre.name.toLowerCase()}
                    style={getStyles(genre, movie.allGenres, theme)}
                  >
                    {genre.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="addMovieItem hideLegend">
              <label htmlFor="duration">Actors</label>
              <Select
                name="actorsBelongTo"
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={movie.actorsBelongTo}
                input={<OutlinedInput label="Actors" />}
                MenuProps={MenuProps}
                onChange={handleChangeInput}
              >
                {actors.map((actor) => (
                  <MenuItem
                    key={actor._id}
                    value={actor.name.toLowerCase()}
                    style={getStyles(actor, movie.actorsBelongTo, theme)}
                  >
                    {actor.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="addMovieItem hideLegend">
              <label htmlFor="duration">Directors</label>
              <Select
                name="directorsBelongTo"
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={movie.directorsBelongTo}
                input={<OutlinedInput label="Directors" />}
                MenuProps={MenuProps}
                onChange={handleChangeInput}
              >
                {directors.map((director) => (
                  <MenuItem
                    key={director._id}
                    value={director.name.toLowerCase()}
                    style={getStyles(director, movie.directorsBelongTo, theme)}
                  >
                    {director.name}
                  </MenuItem>
                ))}
              </Select>
            </div>

            <button className="addMovieButton">Update</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditMovie;
