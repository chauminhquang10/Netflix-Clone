import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { GlobalState } from "../../../GlobalState";
import PuffLoader from "react-spinners/PuffLoader";
import "./CreateMovie.css";
import { useHistory, useParams } from "react-router-dom";

const initialState = {
  title: "",
  desc: "How to and tutorial videos of cool CSS effect, Web Design ideas,JavaScript libraries, Node.",
  year: 0,
  limitAge: 0,
  duration: 0,
  genre: "",
};

const CreateMovie = () => {
  const state = useContext(GlobalState);
  const [isAdmin] = state.usersAPI.isAdmin;
  const [movie, setMovie] = useState(initialState);
  const [token] = state.token;
  const [genres] = state.genresAPI.genres;
  const [img, setImg] = useState(false);
  const [smallImg, setSmallImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const param = useParams();
  const [movies] = state.moviesAPI.movies;
  const [onEdit, setOnEdit] = useState(false);
  const [moviesCallback, setMoviesCallback] = state.moviesAPI.moviesCallback;

  useEffect(() => {
    if (param.id) {
      setOnEdit(true);
      movies.forEach((movie) => {
        if (movie._id === param.id) {
          setMovie(movie);
          setImg(movie.img);
        }
      });
    } else {
      setOnEdit(false);
      setMovie(initialState);
      setImg(false);
    }
  }, [param.id, movies]);

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

      if (onEdit) {
        await axios.put(
          `/api/movies/${movie._id}`,
          { ...movie, img },
          {
            headers: {
              Authorization: token,
            },
          }
        );
      } else {
        await axios.post(
          "/api/movies",
          { ...movie, img },
          {
            headers: {
              Authorization: token,
            },
          }
        );
      }

      setMoviesCallback(!moviesCallback);
      history.push("/");
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const styleUpload = {
    display: img ? "block" : "none",
  };

  return (
    <div className="create_movie">
      <div className="upload">
        <input
          type="file"
          name="file"
          id="file_up"
          onChange={handleUpload}
        ></input>
        {loading ? (
          <div className="loading_img">
            <PuffLoader color={"#36D7B7"} loading={true} size={120} />
          </div>
        ) : (
          <div id="file_img" style={styleUpload}>
            <img src={img ? img.url : ""} alt=""></img>
            <span onClick={handleDelete}>X</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
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
        <div className="row">
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
        <div className="row">
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
        <div className="row">
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

        <button type="submit">{onEdit ? "Update" : "Create"}</button>
      </form>
    </div>
  );
};

export default CreateMovie;
