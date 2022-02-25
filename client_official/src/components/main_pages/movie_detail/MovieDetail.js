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
import axios from "axios";

// import LikeAndShare from "../../Social Plugin/LikeAndShare";
// import Comment from "../../Social Plugin/Comment";

import Comments from "./Comments/Comments";

const MovieDetail = () => {
  const params = useParams();
  const state = useContext(GlobalState);
  const [movies] = state.moviesAPI.movies;
  const [genres] = state.genresAPI.genres;
  const [movieDetail, setMovieDetail] = useState([]);
  const [watchList, setWatchList] = state.usersAPI.watchList;
  const addToWatchList = state.usersAPI.addToWatchList;
  const removeFromWatchList = state.usersAPI.removeFromWatchList;

  const [moviesCallback, setMoviesCallback] = state.moviesAPI.moviesCallback;

  //comments khách hàng
  const [commentList, setCommentList] = useState([]);

  const [commentCallback, setCommentCallback] = useState(false);

  //biến ktra xem movie detail này đã có trong watchList hay chưa?
  const [isAddedToWatchList, setIsAddedToWatchList] = useState(false);

  //hiển thị thể loại của sản phẩm
  const [movieGenre, setMovieGenre] = useState([]);

  useEffect(() => {
    const getDetailMovie = async () => {
      if (params.id) {
        if (movies.every((movie) => movie._id !== params.id)) {
          try {
            const res = await axios.get(`/api/movies/${params.id}`);
            if (res.data.movie !== null) {
              setMovieDetail(res.data.movie);
              // reload để cập nhật phim mới vào danh sách phim
              setMoviesCallback(!moviesCallback);
            }
          } catch (error) {
            alert(error.response.data.msg);
          }
        } else {
          movies.forEach((movie) => {
            if (movie._id === params.id) setMovieDetail(movie);
          });
        }
      }
    };
    getDetailMovie();
  }, [params.id, movies]);

  useEffect(() => {
    if (movieDetail.length !== 0) {
      genres.forEach((genre) => {
        if (genre._id === movieDetail.genre) {
          setMovieGenre(genre);
        }
      });
    }
  }, [movieDetail, genres]);

  useEffect(() => {
    if (movieDetail.length !== 0) {
      watchList.forEach((item) => {
        if (item._id === movieDetail._id) {
          setIsAddedToWatchList(true);
        }
      });
    }
  }, [movieDetail, watchList]);

  useEffect(() => {
    const getAllComments = async () => {
      const res = await axios.get(`/api/getAllComments/${movieDetail._id}`);
      setCommentList(res.data.comments);
    };

    if (movieDetail.length !== 0) getAllComments();
  }, [movieDetail, commentCallback]);

  // tránh trường hợp chưa có dữ liệu mà render thì văng lỗi
  if (movieDetail.length === 0) return null;

  let currentURL =
    +process.env.REACT_APP_IS_LOCALHOST === 1
      ? "https://netflix-chat-bot.herokuapp.com/"
      : window.location.href;

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
                <Link
                  className="detail_link"
                  to={`/watch/${movieDetail.TMDBid}/${movieDetail._id}`}
                >
                  <button className="play">
                    <PlayArrow />
                    <span className="Movie_detail_span">Play</span>
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
      {/* <div className="container">
        <div className="section mb-3">
          <VideoList></VideoList>
        </div>
        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>Recommendations</h2>
          </div>
          <MovieList movies={movies} movieDetail={movieDetail}></MovieList>
        </div>
      </div> */}

      {/* Facebook Plugins  */}
      {/* <div className="Comment_container">
        <LikeAndShare dataHref={currentURL} />
        <Comment width={"100%"} dataHref={currentURL} />
      </div> */}

      <Comments
        movieId={movieDetail._id}
        commentList={commentList}
        setCommentList={setCommentList}
        commentCallback={commentCallback}
        setCommentCallback={setCommentCallback}
      ></Comments>
    </>
  );
};

export default MovieDetail;
