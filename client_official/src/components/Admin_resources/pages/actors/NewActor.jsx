import React, { useState, useContext } from "react";
import "./NewActor.scss";
import axios from "axios";
import { GlobalState } from "../../../../GlobalState";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";

const Gender = ["Not specified", "Female", "Male"];

const initialState = {
  name: "",
  image: "",
  gender: "",
  place_of_birth: "",
  birthday: "",
  biography: "",
  tmdbID: "",
};

const ActorDetail = () => {
  const [actor, setActor] = useState(initialState);
  const state = useContext(GlobalState);
  const [isAdmin] = state.usersAPI.isAdmin;
  const [token] = state.token;
  //const [moviesCallback, setMoviesCallback] = state.moviesAPI.moviesCallback;
  const [actors, setActors] = state.actorsAPI.actors;
  const [imgSmall, setImgSmall] = useState("");
  const history = useHistory();

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

      const res = await axios.post("/api/uploadSmall", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });
      setImgSmall(res.data.url);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const handleChangeInput = async (e) => {
    const { name, value } = e.target;
    setActor({ ...actor, [name]: value });
  };

  const handleFetchData = async (e, id) => {
    e.preventDefault();
    try {
      await fetch(
        `https://api.themoviedb.org/3/person/${id}?api_key=ce69864d6bf2d8c310737e66f4e7a4f3&language=en-US`
      )
        .then((data) => data.json())
        .then(async (data) => {
          setImgSmall(
            `https://image.tmdb.org/t/p/original/${data.profile_path}`
          );
          setActor({
            name: data.name,
            gender: Gender[data.gender],
            place_of_birth: data.place_of_birth,
            birthday: data.birthday,
            biography: data.biography,
            tmdbID: data.id,
          });
        });
    } catch (err) {
      console.error(err);
    }
    console.log(actor);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert("You're not an admin");
      if (!imgSmall) return alert("No image upload");

      const res = await axios.post(
        "/api/actors",
        {
          ...actor,
          imgSmall,
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

      history.push("/actors");

      //  setMoviesCallback(!moviesCallback);
      res.data?.createdActor && setActors([...actors, res.data.createdActor]);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  return (
    <form className="addMovieForm">
      <div className="newMovie">
        <div className="child_container">
          <div class="file-upload">
            <label className="Addmovie-label">Profile Image</label>
            {imgSmall ? (
              <div class="file-upload-content">
                <img class="file-upload-image" src={imgSmall} alt="" />
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
            <label htmlFor="title">Birthday</label>
            <input
              type="text"
              name="birthday"
              id="birthday"
              required
              value={actor.birthday}
              onChange={handleChangeInput}
            ></input>
          </div>
          <div className="addMovieItem">
            <label htmlFor="title">Biography</label>
            <input
              type="text"
              name="biography"
              id="biography"
              required
              value={actor.biography}
              onChange={handleChangeInput}
            ></input>
          </div>
          <div className="addMovieItem">
            <label htmlFor="title">Place Of Birth</label>
            <input
              type="text"
              name="place_of_birth"
              id="place_of_birth"
              required
              value={actor.place_of_birth}
              onChange={handleChangeInput}
            ></input>
          </div>
        </div>
        <div className="child_container">
          <div className="addMovieItem">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={actor.name}
              onChange={handleChangeInput}
            ></input>
          </div>
          <div className="addMovieItem">
            <label htmlFor="title">Gender</label>
            <input
              type="text"
              name="gender"
              id="gender"
              required
              value={actor.gender}
              onChange={handleChangeInput}
            ></input>
          </div>
          <div className="addMovieItem">
            <label htmlFor="year">TMDB ID</label>
            <input
              type="number"
              name="tmdbID"
              id="tmdbID"
              required
              value={actor.tmdbID}
              onChange={handleChangeInput}
            ></input>
          </div>
          <div className="Button_Gr">
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
                handleFetchData(e, actor.tmdbID);
              }}
              className="addMovieButton"
            >
              Fetch Data
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ActorDetail;
