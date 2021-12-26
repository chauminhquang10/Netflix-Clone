import React, { useState, useContext } from "react";
import "./NewMovie.css";
import PuffLoader from "react-spinners/PuffLoader";
import axios from "axios";
import { GlobalState } from "../../../../GlobalState";
import { useHistory, useParams } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@material-ui/core";

const initialState = {
  title: "",
  desc: "Movie decscription",
  year: 0,
  limitAge: 0,
  duration: 0,
  genre: "",
  trailer: "",
  TMDBid: "",
};

const NewMovie = () => {
  const [movie, setMovie] = useState(initialState);

  const state = useContext(GlobalState);
  const [isAdmin] = state.usersAPI.isAdmin;
  const [token] = state.token;
  const [genres] = state.genresAPI.genres;
  const [img, setImg] = useState(false);
  const [imgSmall, setImgSmall] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const param = useParams();
  const [moviesCallback, setMoviesCallback] = state.moviesAPI.moviesCallback;

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
      setImg(res.data);
      console.log("Uploaded");
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
      setImgSmall(res.data);
      console.log("Uploaded 2");
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const handleDelete = async () => {
    try {
      if (!isAdmin) return alert("You're not an admin");
      setLoading(true);
      await axios.post(
        "/api/delete",
        { public_id: img.public_id },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setLoading(false);
      setImg(false);
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

      await axios.post(
        "/api/movies",
        { ...movie, img, imgSmall },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setMoviesCallback(!moviesCallback);
      history.push("/movies");
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  return (
    <form className="addMovieForm" onSubmit={handleSubmit}>
      <div className="newMovie">
        <div className="child_container">
          <div class="file-upload">
            <label className="Addmovie-label">BackDrop</label>
            {img ? (
              <div class="file-upload-content">
                <img class="file-upload-image" src={img.url} alt="your image" />
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
                  src={imgSmall.url}
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
            <label htmlFor="genres">Genres:</label>
            <select
              name="genre"
              value={movie.genre}
              onChange={handleChangeInput}
            >
              <option value="">Please select a genre</option>
              {genres.map((genre) => (
                <option value={genre._id} key={genre._id}>
                  {genre.name}
                </option>
              ))}
            </select>
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
          <button className="addMovieButton">Create</button>
        </div>
      </div>
    </form>
  );
};

export default NewMovie;
