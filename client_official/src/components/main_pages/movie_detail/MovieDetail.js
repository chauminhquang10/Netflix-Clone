import React, { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import CastList from "./CastList";
import VideoList from "./VideoList";
import "./MovieDetail.scss";
import { PlayArrow } from "@material-ui/icons";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";
import PopUp from "../utils/popup/PopUp";

import Comments from "./Comments/Comments";

import CommentDisplayRating from "./Comments/CommentDisplayRating";

import LikeButton from "./LikeButton";

import DislikeButton from "./DislikeButton";

import Listitem from "../main/list/List";
import SkeletonList from "../utils/skeleton/SkeletonList/SkeletonList";

const MovieDetail = () => {
  const params = useParams();
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [userData] = state.usersAPI.userData;
  const [movies] = state.moviesAPI.movies;
  const [movieDetail, setMovieDetail] = useState([]);
  const [watchList, setWatchList] = state.usersAPI.watchList;
  const addToWatchList = state.usersAPI.addToWatchList;
  const removeFromWatchList = state.usersAPI.removeFromWatchList;
  const [topRanking] = state.topRanking;
  const [moviesCallback, setMoviesCallback] = state.moviesAPI.moviesCallback;

  // likedGenres (danh sách thể loại yêu thích của người dùng cho model)
  const [likedGenres, setLikedGenres] = state.usersAPI.likedGenres;

  //comments khách hàng
  const [commentList, setCommentList] = useState([]);

  const [commentCallback, setCommentCallback] = useState(false);

  //biến ktra xem movie detail này đã có trong watchList hay chưa?
  const [isAddedToWatchList, setIsAddedToWatchList] = useState(false);

  const [isNotExpireAccount, setIsNotExpireAccount] =
    state.usersAPI.isNotExpireAccount;

  //trigger Popup
  const [popupTrigger, setPopupTrigger] = useState(false);
  const [listTrigger, setListTrigger] = useState(true);
  // like featured
  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);

  // dislike featured
  const [isDislike, setIsDislike] = useState(false);
  const [loadDislike, setLoadDislike] = useState(false);

  // TỔNG SỐ LIKE
  const [likesNumber, setLikesNumber] = useState(0);
  // TỔNG SỐ DISLIKE
  const [dislikesNumber, setDislikesNumber] = useState(0);

  // DANH SÁCH PHIM CÙNG THỂ LOẠI
  const [similarMovies, setSimilarMovies] = useState([]);

  // callback dành riêng cho movie detail
  const [movieDetailCallback, setMovieDetailCallback] = useState(false);

  useEffect(() => {
    const getDetailMovie = async () => {
      if (params.id) {
        try {
          const res = await axios.get(`/api/movies/${params.id}`);
          if (res.data.movie !== null) {
            setMovieDetail(res.data.movie);

            setLikesNumber(res.data.movie.likes.length);
            setDislikesNumber(res.data.movie.dislikes.length);

            // lọc lại giá trị các genres id thành mảng truyền xuống backend
            let allGenreIDs = [];

            // if (res.data.movie?.allGenres) {
            //   allGenreIDs = res.data.movie.allGenres.map(
            //     (genreItem) => genreItem._id
            //   );

            //   await getSimilarMovies(allGenreIDs);
            // }

            // reload để cập nhật phim mới vào danh sách phim
            if (movies.every((movie) => movie._id !== params.id))
              setMoviesCallback(!moviesCallback);
          }
        } catch (error) {
          alert(error.response.data.msg);
        }
      }
    };

    const getSimilarMovies = async (allGenreIDs) => {
      if (allGenreIDs) {
        try {
          const res = await axios.get("/api/similarMovies", allGenreIDs);
          if (res.data.similarMovies.length > 0) {
            setSimilarMovies(res.data.similarMovies);
          }
        } catch (error) {
          alert(error.response.data.msg);
        }
      }
    };

    getDetailMovie();
  }, [params.id, movieDetailCallback]);

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

  //  Likes
  useEffect(() => {
    if (movieDetail.length !== 0) {
      if (movieDetail.likes.find((like) => like === userData._id)) {
        setIsLike(true);
      } else {
        setIsLike(false);
      }
    }
  }, [movieDetail.likes, userData._id]);

  //  Dislikes
  useEffect(() => {
    if (movieDetail.length !== 0) {
      if (movieDetail.dislikes.find((dislike) => dislike === userData._id)) {
        setIsDislike(true);
      } else {
        setIsDislike(false);
      }
    }
  }, [movieDetail.dislikes, userData._id]);

  const handlePlayMovie = () => {
    if (!isNotExpireAccount) {
      setPopupTrigger(true);
    }
  };

  const handleLike = async () => {
    try {
      if (loadLike) return;
      setLoadLike(true);

      await axios.patch(`/api/movies/${movieDetail._id}/like`, null, {
        headers: { Authorization: token },
      });

      setIsLike(true);
      setLikesNumber((prev) => prev + 1);

      // xử lí reset điểm khi toggle like/dislike
      let isResetScore = false;

      // nếu nút dislike đã được nhấn (người dùng đã dislike trước đó)
      if (isDislike) {
        setIsDislike(false);
        setDislikesNumber((prev) => prev - 1);
        isResetScore = true;
      }

      // xử lí tăng lượt viewcount cho thể loại thích
      const { allGenres } = movieDetail;
      const isUpViewCount = true;
      handleUpdateViewCount(allGenres, isUpViewCount, isResetScore);

      setLoadLike(false);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const handleUnLike = async () => {
    try {
      if (loadLike) return;
      setLoadLike(true);

      await axios.patch(`/api/movies/${movieDetail._id}/unlike`, null, {
        headers: { Authorization: token },
      });

      setIsLike(false);
      setLikesNumber((prev) => prev - 1);

      let isResetScore = false;

      // xử lí giảm lượt viewcount cho thể loại thích
      const { allGenres } = movieDetail;
      const isUpViewCount = false;
      handleUpdateViewCount(allGenres, isUpViewCount, isResetScore);

      setLoadLike(false);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const handleDislike = async () => {
    try {
      if (loadDislike) return;
      setLoadDislike(true);

      await axios.patch(`/api/movies/${movieDetail._id}/dislike`, null, {
        headers: { Authorization: token },
      });

      setIsDislike(true);
      setDislikesNumber((prev) => prev + 1);

      // biến cờ để chỉnh lại điểm viewcount khi toggle like/dislike.
      // thay vì -10 thì nó trừ 20.
      // vì từ trạng thái like sang dislike
      // (ví dụ : là từ +10 thành -10)
      // không phải 10 thành 0
      let isResetScore = false;

      // nếu nút like đã được nhấn (người dùng đã dislike trước đó)
      if (isLike) {
        setIsLike(false);
        setLikesNumber((prev) => prev - 1);
        isResetScore = true;
      }

      // xử lí giảm lượt viewcount cho thể loại thích
      const { allGenres } = movieDetail;
      const isUpViewCount = false;
      handleUpdateViewCount(allGenres, isUpViewCount, isResetScore);

      setLoadDislike(false);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const handleUnDislike = async () => {
    try {
      if (loadDislike) return;
      setLoadDislike(true);

      await axios.patch(`/api/movies/${movieDetail._id}/unDislike`, null, {
        headers: { Authorization: token },
      });

      setIsDislike(false);
      setDislikesNumber((prev) => prev - 1);

      let isResetScore = false;

      // xử lí tăng lượt viewcount cho thể loại thích

      const { allGenres } = movieDetail;
      const isUpViewCount = true;
      handleUpdateViewCount(allGenres, isUpViewCount, isResetScore);

      setLoadDislike(false);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const handleUpdateViewCount = async (
    allGenres,
    isUpViewCount,
    isResetScore
  ) => {
    // giao của 2 mảng
    const intersectionResult = likedGenres.filter((item1) =>
      allGenres.some((item2) => item1.id === item2._id)
    );

    // trừ của 2 mảng
    const subtractResult = allGenres.filter(
      (item1) => !likedGenres.some((item2) => item1._id === item2.id)
    );

    if (intersectionResult.length > 0) {
      if (isUpViewCount) {
        intersectionResult.filter((item) => {
          return plusTenToExistGenre(item.id, likedGenres, isResetScore);
        });
      } else {
        intersectionResult.filter((item) => {
          return minusTenToExistGenre(item.id, likedGenres, isResetScore);
        });
      }
      setLikedGenres([...likedGenres]);

      await axios.patch(
        "/user/countLikes",
        {
          likedGenres: [...likedGenres],
        },
        {
          headers: { Authorization: token },
        }
      );
    }

    if (subtractResult.length > 0) {
      let finalResult;
      if (isUpViewCount) {
        finalResult = subtractResult.map((item) => ({
          id: item._id,
          viewCount: 10,
        }));
      } else {
        finalResult = subtractResult.map((item) => ({
          id: item._id,
          viewCount: -10,
        }));
      }
      setLikedGenres([...likedGenres, ...finalResult]);
      await axios.patch(
        "/user/countLikes",
        {
          likedGenres: [...likedGenres, ...finalResult],
        },
        {
          headers: { Authorization: token },
        }
      );
    }
  };

  const plusTenToExistGenre = (itemId, likedGenres, isResetScore) => {
    likedGenres.forEach((item) => {
      if (item.id === itemId) {
        if (isResetScore) item.viewCount += 20;
        else {
          item.viewCount += 10;
        }
      }
    });
  };

  const minusTenToExistGenre = (itemId, likedGenres, isResetScore) => {
    likedGenres.forEach((item) => {
      if (item.id === itemId) {
        if (isResetScore) item.viewCount -= 20;
        else {
          item.viewCount -= 10;
        }
      }
    });
  };

  const ToggleTrigger = (value) => {
    setListTrigger(value);
  };

  const getTrigger = () => {
    return listTrigger;
  };

  // tránh trường hợp chưa có dữ liệu mà render thì văng lỗi
  if (movieDetail.length === 0) return null;

  return (
    <div className="movieDetail-section">
      <div className="movie_detail_popup_container">
        <PopUp trigger={popupTrigger} setTrigger={setPopupTrigger}></PopUp>
      </div>
      <div
        className="banner"
        style={{
          backgroundImage: `url(${movieDetail.img})`,
        }}
      ></div>
      <div className="header-container">
        <div className="poster-container">
          <div className="poster">
            <img className="poster-img" src={movieDetail.imgSmall}></img>
          </div>
        </div>
        <div className="info-container">
          <h1 className="title">{movieDetail.title}</h1>
          <div className="genre">
            {movieDetail?.allGenres.map((item, index) => (
              <div className="genre__item" key={index}>
                {item?.name}
              </div>
            ))}
          </div>
          <p className="overview">{movieDetail.desc}</p>
          <CommentDisplayRating
            rating={movieDetail.rating}
          ></CommentDisplayRating>
          <div className="react-container">
            <div className="like-container">
              <LikeButton
                isLike={isLike}
                handleLike={handleLike}
                handleUnLike={handleUnLike}
              />
              <h6>{likesNumber} likes</h6>
            </div>
            <div className="dislike-container">
              <DislikeButton
                isDislike={isDislike}
                handleDislike={handleDislike}
                handleUnDislike={handleUnDislike}
              />
              <h6>{dislikesNumber} dislikes</h6>
            </div>
          </div>
          <div className="cast-container">
            <div className="header">
              <h2>Casts</h2>
            </div>
            {movieDetail?.actorsBelongTo && (
              <CastList actors={movieDetail.actorsBelongTo} />
            )}
          </div>
          <div className="movie_detail_buttons">
            <div className="buttons">
              {isNotExpireAccount ? (
                <Link
                  className="detail_link"
                  to={`/watch/${movieDetail.TMDBid}/${movieDetail._id}`}
                >
                  <button className="play">
                    <PlayArrow />
                    <span className="Movie_detail_span">Play</span>
                  </button>
                </Link>
              ) : (
                <button className="play" onClick={handlePlayMovie}>
                  <PlayArrow />
                  <span className="Movie_detail_span">Play</span>
                </button>
              )}

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
      {movieDetail && (
        <div className="trailer-container">
          <iframe
            width="971"
            height="546"
            src={movieDetail.trailer.replace(
              "https://www.youtube.com/watch?v=",
              "https://www.youtube.com/embed/"
            )}
            title="Trailer"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      )}
      <Comments
        movieId={movieDetail._id}
        commentList={commentList}
        setCommentList={setCommentList}
        commentCallback={commentCallback}
        setCommentCallback={setCommentCallback}
        movieDetailCallback={movieDetailCallback}
        setMovieDetailCallback={setMovieDetailCallback}
      ></Comments>
      <div className="list-item-container">
        {topRanking ? (
          <Listitem
            movies={topRanking}
            title="Similar Movies"
            getTrigger={getTrigger}
            ToggleTrigger={ToggleTrigger}
          ></Listitem>
        ) : (
          <SkeletonList />
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
