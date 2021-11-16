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
  desc: "How to and tutorial videos of cool CSS effect, Web Design ideas,JavaScript libraries, Node.",
  year: 0,
  limitAge: 0,
  duration: 0,
  genre: "",
};

const NewMovie = () => {
  const [movie, setMovie] = useState(initialState);

  const state = useContext(GlobalState);
  const [isAdmin] = state.usersAPI.isAdmin;
  const [token] = state.token;
  const [genres] = state.genresAPI.genres;
  const [img, setImg] = useState(false);
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
        { ...movie, img },
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
    <div className="newMovie">
      <h1 className="addMovieTitle">New Movie</h1>
      <form className="addMovieForm">
        <div className="addMovieItem">
          <label>Image</label>
          <input type="file" id="file" />
        </div>
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

        <div className="addMovieItem">
          <label htmlFor="genres">Genres:</label>
          <select name="genre" value={movie.genre} onChange={handleChangeInput}>
            <option value="">Please select a genre</option>
            {genres.map((genre) => (
              <option value={genre._id} key={genre._id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
        <button className="addMovieButton">Create</button>
      </form>
    </div>
  );
};

export default NewMovie;
