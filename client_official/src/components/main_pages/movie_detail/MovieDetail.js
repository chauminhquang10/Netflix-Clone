import React, { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import CastList from "./CastList";
import VideoList from "./VideoList";
import "./MovieDetail.scss";
import { Button } from "../../button/Button";
import { PlayArrow } from "@material-ui/icons";
import MovieList from "../movie-list/MovieList";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { OutlineButton } from "../../button/Button";

const MovieDetail = () => {
  const params = useParams();
  const state = useContext(GlobalState);
  const [movies] = state.moviesAPI.movies;
  const [genres] = state.genresAPI.genres;
  const [movieDetail, setMovieDetail] = useState([]);
  const [watchList, setWatchList] = state.usersAPI.watchList;
  const addToWatchList = state.usersAPI.addToWatchList;
  const removeFromWatchList = state.usersAPI.removeFromWatchList;

  const [isCommented, setIsCommented] = useState(false);
  const [productDetail, setProductDetail] = useState([]);
  //comments khách hàng
  const [comments, setComments] = useState([]);

  //biến ktra xem movie detail này đã có trong watchList hay chưa?
  const [isAddedToWatchList, setIsAddedToWatchList] = useState(false);

  //hiển thị thể loại của sản phẩm
  const [movieGenre, setMovieGenre] = useState([]);

  useEffect(() => {
    if (params.id) {
      movies.forEach((movie) => {
        if (movie._id === params.id) setMovieDetail(movie);
      });
    }
  }, [params.id, movies]);

  useEffect(() => {
    if (movieDetail) {
      genres.forEach((genre) => {
        if (genre._id === movieDetail.genre) {
          setMovieGenre(genre);
        }
      });
    }
  }, [movieDetail, genres]);

  useEffect(() => {
    if (movieDetail) {
      watchList.forEach((item) => {
        if (item._id === movieDetail._id) {
          setIsAddedToWatchList(true);
        }
      });
    }
  }, [movieDetail, watchList]);

  // tránh trường hợp chưa có dữ liệu mà render thì văng lỗi
  if (movieDetail.length === 0) return null;

  return (
    <>
      <div
        className="banner"
        style={{
          backgroundImage: `url(${movieDetail.img.url})`,
        }}
      ></div>
      <div className="mb-3 movie-content container">
        <div className="movie-content__poster">
          <div
            className="movie-content__poster__img"
            style={{
              backgroundImage: `url(${
                movieDetail.imgSmall
                  ? movieDetail.imgSmall.url
                  : movieDetail.img.url
              })`,
            }}
          ></div>
        </div>
        <div className="movie-content__info">
          <h1 className="title">{movieDetail.title}</h1>
          <div className="genre">
            <span className="genre__item">{movieGenre.name}</span>
          </div>
          <p className="overview">{movieDetail.desc}</p>
          <div className="cast">
            <div className="section__header">
              <h2>Casts</h2>
            </div>
            <CastList />

            <div className="movie_detail_buttons">
              <div className="buttons">
                <Link to={{ pathname: "/watch", movieDetail }}>
                  <button className="play">
                    <PlayArrow />
                    <span>Play</span>
                  </button>
                </Link>

                {isAddedToWatchList ? (
                  <button
                    className="more"
                    onClick={() => {
                      removeFromWatchList(movieDetail._id);
                      setIsAddedToWatchList(false);
                    }}
                  >
                    <RemoveIcon />
                    Remove
                  </button>
                ) : (
                  <button
                    className="more"
                    onClick={() => {
                      addToWatchList(movieDetail);
                      setIsAddedToWatchList(true);
                    }}
                  >
                    <AddIcon />
                    My List
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="section mb-3">
          <VideoList></VideoList>
        </div>
        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>Recommendations</h2>
          </div>
          <MovieList movies={movies} movieDetail={movieDetail}></MovieList>
        </div>
      </div>
    </>
  );
};

export default MovieDetail;
