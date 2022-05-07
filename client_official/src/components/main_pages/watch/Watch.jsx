import { ArrowBackOutlined } from "@material-ui/icons";
import React, { useContext, useState, useEffect } from "react";
import "./Watch.scss";
import { useParams } from "react-router-dom";

import CountTimer from "./CountTimer";
import { GlobalState } from "../../../GlobalState";

const Watch = () => {
  const params = useParams();
  const state = useContext(GlobalState);
  const [genres] = state.genresAPI.genres;

  //hiển thị thể loại của sản phẩm
  const [movieGenre, setMovieGenre] = useState([]);

  useEffect(() => {
    genres.forEach((genre) => {
      if (genre._id === params.genreId) {
        setMovieGenre(genre);
      }
    });
  }, [genres, params]);

  return (
    <>
      <div className="watch">
        <iframe
          width="100%"
          height="100%"
          src={
            params.TMDBid
              ? `https://www.2embed.ru/embed/tmdb/movie?id=${params.TMDBid}`
              : "https://res.cloudinary.com/minh-quang-21-kg/video/upload/v1638518344/Video/StarCraft_II-_Heart_of_the_Swarm_Opening_Cinematic_uh2cpa.mkv"
          }
          frameborder="0"
          allowfullscreen="true"
        ></iframe>
      </div>
      <CountTimer genreName={movieGenre.name} movieId={params.movieId} />
    </>
  );
};

export default Watch;
