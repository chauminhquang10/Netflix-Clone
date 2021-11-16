import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { GlobalState } from "../../../../GlobalState";
import PuffLoader from "react-spinners/PuffLoader";
import "./EditMovie.css";
import { Link, useHistory, useParams } from "react-router-dom";
import Chart from "../../Admin_components/chart/Chart";
import { productData } from "../../Admin_components/dummyData";
import { Publish } from "@material-ui/icons";
import { FormControl, Select, MenuItem } from "@material-ui/core";

const initialState = {
  title: "",
  desc: "How to and tutorial videos of cool CSS effect, Web Design ideas,JavaScript libraries, Node.",
  year: 0,
  limitAge: 0,
  duration: 0,
  genre: "",
};

const EditMovie = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [isAdmin] = state.usersAPI.isAdmin;
  const [movie, setMovie] = useState(initialState);
  const [movies] = state.moviesAPI.movies;
  const [genres] = state.genresAPI.genres;
  const [img, setImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const param = useParams();
  const [moviesCallback, setMoviesCallback] = state.moviesAPI.moviesCallback;

  //hiển thị thể loại của phim
  const [movieGenre, setMovieGenre] = useState([]);

  useEffect(() => {
    if (param.id) {
      movies.forEach((movie) => {
        if (movie._id === param.id) {
          setMovie(movie);
          setImg(movie.img);
        }
      });
    }
  }, [param.id, movies]);

  useEffect(() => {
    if (movie) {
      genres.forEach((genre) => {
        if (genre._id === movie.genre) {
          setMovieGenre(genre);
        }
      });
    }
  }, [movie, genres]);

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

      await axios.put(
        `/api/movies/${movie._id}`,
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
    <div className="movie">
      <div className="movieTitleContainer">
        <Link to="/newMovie">
          <button className="movieAddButton">Create</button>
        </Link>
      </div>
      <div className="movieTop">
        <div className="movieTopLeft">
          <Chart
            data={productData}
            dataKey="Sales"
            title="Views Performance"
          ></Chart>
        </div>
        <div className="movieTopRight">
          <div className="movieInfoBottom">
            <div className="movieInfoItem">
              <span className="movieInfoName">
                {movie.title.replace(/\w\S*/g, (w) =>
                  w.replace(/^\w/, (c) => c.toUpperCase())
                )}
              </span>
            </div>
            <div className="movieInfoItem">
              <span className="movieInfoKey">Description:</span>
              <span className="movieInfoValue">{movie.desc}</span>
            </div>
            <div className="movieInfoItem">
              <span className="movieInfoKey">Genre:</span>
              <span className="movieInfoValue">{movieGenre.name}</span>
            </div>
            <div className="movieInfoItem">
              <span className="movieInfoKey">Views:</span>
              <span className="movieInfoValue">{movie.views}</span>
            </div>
            <div className="movieInfoItem">
              <span className="movieInfoKey">Rating:</span>
              <span className="movieInfoValue">{movie.rating}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="movieBottom" onSubmit={handleSubmit}>
        <form className="movieForm">
          <div className="movieFormLeft">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              required
              value={movie.title}
              onChange={handleChangeInput}
            ></input>
            <label htmlFor="year">Year</label>
            <input
              type="number"
              name="year"
              id="year"
              required
              value={movie.year}
              onChange={handleChangeInput}
            ></input>
            <label htmlFor="duration">Duration</label>
            <input
              type="number"
              name="duration"
              id="duration"
              required
              value={movie.duration}
              onChange={handleChangeInput}
            ></input>
            <label htmlFor="limitAge">Limit Age</label>
            <input
              type="number"
              name="limitAge"
              id="limitAge"
              required
              value={movie.limitAge}
              onChange={handleChangeInput}
            ></input>
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

            <label htmlFor="genres">Genres</label>
            <FormControl>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={movie.genre}
                name="genre"
                onChange={handleChangeInput}
              >
                {genres.map((genre) => (
                  <MenuItem value={genre._id} key={genre._id}>
                    {genre.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="movieFormRight">
            <div className="movieUpload">
              <img
                className="movieUploadImg"
                src={img.url}
                alt="movie-img"
              ></img>
              <label htmlFor="file">
                <Publish></Publish>
              </label>
              <input type="file" id="file" style={{ display: "none" }}></input>
            </div>
            <button className="movieButton">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMovie;
