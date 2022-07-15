import React, { useState, useContext } from "react";
import "./NewMovie.scss";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { GlobalState } from "../../../../GlobalState";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import swal from "sweetalert";
import { createNotify } from "../../../../redux/actions/notifyAction";

import { Select, MenuItem, OutlinedInput } from "@material-ui/core";

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
  original_language: "",
  imdbId: "",
  imdb_rating: 0,
  original_country: "",
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

const NewMovie = () => {
  const [movie, setMovie] = useState(initialState);

  const { socket } = useSelector((state) => state);
  const dispatch = useDispatch();
  const state = useContext(GlobalState);
  const [isAdmin] = state.usersAPI.isAdmin;
  const [token] = state.token;
  const [userData] = state.usersAPI.userData;
  const [genres] = state.genresAPI.genres;
  const [actors] = state.actorsAPI.actors;
  const [directors] = state.directorsAPI.directors;
  const [img, setImg] = useState(false);
  const [imgSmall, setImgSmall] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  // const [moviesCallback, setMoviesCallback] = state.moviesAPI.moviesCallback;
  const [movies, setMovies] = state.moviesAPI.movies;
  const theme = useTheme();

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
      const fileSmall = e.target.files[0];

      if (!fileSmall) return alert("File not exist");

      if (fileSmall.size > 2000 * 2000) return alert("Size too large");

      if (fileSmall.type !== "image/png" && fileSmall.type !== "image/jpeg")
        return alert("File format is incorrect");

      let formData = new FormData();
      formData.append("file", fileSmall);

      setLoading(true);

      const res = await axios.post("/api/uploadSmall", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });
      setLoading(false);
      setImgSmall(res.data.url);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const handleChangeInput = async (e) => {
    const { name, value } = e.target;
    setMovie({ ...movie, [name]: value });
  };

  async function FetchGenres(desc) {
    try {
      const genres = [];
      const res = await axios.post(
        "/api/fetchGenres",
        { desc },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      res.data.msg.forEach((genre) => {
        genres.push(genre.toLowerCase());
      });
      return genres;
    } catch (error) {
      alert(error.response.data.msg);
    }
  }
  //hello
  const handleFetchData = async (e, id) => {
    e.preventDefault();
    try {
      await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=ce69864d6bf2d8c310737e66f4e7a4f3&append_to_response=videos`
      )
        .then((data) => data.json())
        .then(async (data) => {
          setImg(`https://image.tmdb.org/t/p/original/${data.backdrop_path}`);
          setImgSmall(
            `https://image.tmdb.org/t/p/original/${data.poster_path}`
          );
          const Genres = await FetchGenres(data.overview);
          setMovie({
            title: data.original_title,
            desc: data.overview,
            year: data.release_date.split("-")[0],
            limitAge: 0,
            TMDBid: data.id,
            allGenres: Genres,
            duration: data.runtime,
            actorsBelongTo: movie.actorsBelongTo,
            directorsBelongTo: movie.directorsBelongTo,
            trailer: `https://www.youtube.com/watch?v=${
              data.videos.results[data.videos.results.length - 1]["key"]
            }`,
          });
        });
    } catch (err) {
      console.error(err);
    }
    console.log(movie);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert("You're not an admin");
      if (!img) return alert("No image upload");

      let tempGenres = [];
      for (let i = 0; i < movie.allGenres.length; i++) {
        let rs = genres.find(
          (el) => el.name.toLowerCase() === movie.allGenres[i].toLowerCase()
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
            el.name.toLowerCase() === movie.directorsBelongTo[i].toLowerCase()
        );
        tempDirectors.push(rs._id);
      }

      const res = await axios.post(
        "/api/movies",
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
      swal({
        title: "Info !",
        text: res.data.msg,
        icon: "success",
        confirmButtonText: "Yes",
      });

      // (lúc này thông báo nó phải nhận thêm cái mảng thể loại của phim để truyền xuống backend)
      // (để so sánh với mảng top 3 thể loại yêu thích của user)
      // Notify

      const msg = {
        id: res.data.newMovie._id,
        text: res.data.newMovie.desc,
        url: `/detail/${res.data.newMovie._id}`,
        content: movie.title,
        image: imgSmall,
        // phần thêm để tích hợp model machine learning
        allGenres: res.data.newMovie.allGenres,
      };

      dispatch(createNotify({ msg, socket, token, userData }));

      res.data?.newMovie && setMovies([...movies, res.data?.newMovie]);

      //setMoviesCallback(!moviesCallback);
      history.push("/movies");
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  return (
    <form className="addMovieForm">
      <div className="newMovie">
        <div className="child_container">
          <div className="file-upload">
            <label className="Addmovie-label">BackDrop</label>
            {img ? (
              <div className="file-upload-content">
                <img className="file-upload-image" src={img} alt="your image" />
                <div className="image-title-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setImg(false);
                    }}
                    className="remove-image"
                  >
                    Remove <span className="image-title">Back Drop</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="image-upload-wrap">
                <input
                  className="file-upload-input"
                  type="file"
                  id="file"
                  onChange={handleUpload}
                />
                <div className="drag-text">
                  <h5>Drag and drop a file or select add Back Drop</h5>
                </div>
              </div>
            )}
          </div>
          <div className="file-upload">
            <label className="Addmovie-label">Poster</label>
            {imgSmall ? (
              <div className="file-upload-content">
                <img
                  className="file-upload-image"
                  src={imgSmall}
                  alt="your image"
                />
                <div className="image-title-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setImgSmall(false);
                    }}
                    className="remove-image"
                  >
                    Remove <span className="image-title">Poster</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="image-upload-wrap">
                <input
                  className="file-upload-input"
                  type="file"
                  id="fileSmall"
                  onChange={handleUploadSmall}
                />
                <div className="drag-text">
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
        </div>
        <div className="child_container">
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
          <button
            type="submit"
            onClick={handleSubmit}
            className="addMovieButton"
          >
            Create
          </button>
          <button
            type="submit"
            onClick={(e) => {
              handleFetchData(e, movie.TMDBid);
            }}
            className="addMovieButton"
          >
            Fetch Data
          </button>
        </div>
      </div>
    </form>
  );
};

export default NewMovie;
