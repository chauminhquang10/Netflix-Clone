import { ArrowBackOutlined } from "@material-ui/icons";
import React from "react";
import "./Watch.scss";
import { useParams, Link } from "react-router-dom";

const Watch = () => {
  const params = useParams();
  console.log(params.TMDBid);
  return (
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
  );
};

export default Watch;
