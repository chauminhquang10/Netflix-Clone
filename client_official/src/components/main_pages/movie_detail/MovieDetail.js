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

import PopUp from "../utils/popup/PopUp";

import Comments from "./Comments/Comments";

import CommentDisplayRating from "./Comments/CommentDisplayRating";

import LikeButton from "./LikeButton";

import DislikeButton from "./DislikeButton";

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

  useEffect(() => {
    const getDetailMovie = async () => {
      if (params.id) {
        try {
          const res = await axios.get(`/api/movies/${params.id}`);
          if (res.data.movie !== null) {
            setMovieDetail(res.data.movie);

            setLikesNumber(res.data.movie.likes.length);
            setDislikesNumber(res.data.movie.dislikes.length);

            // reload để cập nhật phim mới vào danh sách phim
            if (movies.every((movie) => movie._id !== params.id))
              setMoviesCallback(!moviesCallback);
          }
        } catch (error) {
          alert(error.response.data.msg);
        }
      }
    };
    getDetailMovie();
  }, [params.id]);

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
    console.log(likedGenres);
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

  // tránh trường hợp chưa có dữ liệu mà render thì văng lỗi
  if (movieDetail.length === 0) return null;

  let currentURL =
    +process.env.REACT_APP_IS_LOCALHOST === 1
      ? "https://netflix-chat-bot.herokuapp.com/"
      : window.location.href;

  return (
    <>
      <div className="movie_detail_popup_container">
        <PopUp trigger={popupTrigger} setTrigger={setPopupTrigger}>
          <h1>Notification !!</h1>
          <p>This is the notification that your account is expired</p>
        </PopUp>
      </div>

      <div
        className="banner"
        style={{
          backgroundImage: `url(${movieDetail.img})`,
        }}
      ></div>
      <div className="mb-3 movie-content container">
        <div className="movie-content__poster">
          <div
            className="movie-content__poster__img"
            style={{
              backgroundImage: `url(${movieDetail.imgSmall})`,
            }}
          ></div>
        </div>
        <div className="movie-content__info">
          <h1 className="title">{movieDetail.title}</h1>
          <div className="genre">
            {movieDetail?.allGenres.map((item, index) => (
              <span className="genre__item" key={index}>
                {item?.name}
              </span>
            ))}
          </div>
          {/* //helo */}
          <p className="overview">{movieDetail.desc}</p>
          {/* Hiển thị số sao trung bình */}
          <CommentDisplayRating
            rating={movieDetail.rating}
          ></CommentDisplayRating>
          {/* Like Featured */}
          <LikeButton
            isLike={isLike}
            handleLike={handleLike}
            handleUnLike={handleUnLike}
          />
          <h6>{likesNumber} likes</h6>
          {/* Dislike Featured */}
          <DislikeButton
            isDislike={isDislike}
            handleDislike={handleDislike}
            handleUnDislike={handleUnDislike}
          />
          <h6>{dislikesNumber} dislikes</h6>

          <div className="cast">
            <div className="section__header">
              <h2>Casts</h2>
            </div>
            {movieDetail?.actorsBelongTo && (
              <CastList actors={movieDetail.actorsBelongTo} />
            )}

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
