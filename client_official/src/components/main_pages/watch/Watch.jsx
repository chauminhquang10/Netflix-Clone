import { ArrowBackOutlined } from "@material-ui/icons";
import React, { useState, useEffect } from "react";
import "./Watch.scss";
import { useParams } from "react-router-dom";

import axios from "axios";
import CountTimer from "./CountTimer";

const Watch = () => {
  const params = useParams();

  //chứa mảng các thể loại của phim
  const [movieGenres, setMovieGenres] = useState([]);

  useEffect(() => {
    const getDetailMovie = async () => {
      if (params.movieId) {
        try {
          const res = await axios.get(`/api/movies/${params.movieId}`);
          if (res.data.movie !== null) {
            setMovieGenres(res.data.movie.allGenres);
          }
        } catch (error) {
          alert(error.response.data.msg);
        }
      }
    };
    getDetailMovie();
  }, [params.movieId]);

  return (
    <>
      <div className="watch">
        <iframe
          width="100%"
          height="100%"
          src={
            params.TMDBid
              ? `https://2embed.org/embed/${params.TMDBid}`
              : "https://res.cloudinary.com/minh-quang-21-kg/video/upload/v1638518344/Video/StarCraft_II-_Heart_of_the_Swarm_Opening_Cinematic_uh2cpa.mkv"
          }
          frameborder="0"
          allowfullscreen="true"
        ></iframe>
      </div>
      <CountTimer movieId={params.movieId} movieGenres={movieGenres} />
    </>
  );
};

export default Watch;
