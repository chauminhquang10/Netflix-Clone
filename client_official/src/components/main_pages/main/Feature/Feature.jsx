import { InfoOutlined, PlayArrow } from "@material-ui/icons";
import "./Feature.scss";
import { Button, OutlineButton } from "../../../button/Button";

function OnScroll() {
  let offset = window.pageYOffset;
  document.getElementById("bigImg").style.backgroundPositionY =
    offset * 0.2 + "px";
}
window.onscroll = () => {
  OnScroll();
};

export default function Featured({ type, setGenre }) {
  return (
    <div className="featured" id="Feature">
      {type && (
        <div className="category">
          <span>{type === "movies" ? "Movies" : "Series"}</span>
          <select
            name="genre"
            id="genre"
            onChange={(e) => setGenre(e.target.value)}
          >
            <option>Genre</option>
            <option value="adventure">Adventure</option>
            <option value="comedy">Comedy</option>
            <option value="crime">Crime</option>
            <option value="fantasy">Fantasy</option>
            <option value="historical">Historical</option>
            <option value="horror">Horror</option>
            <option value="romance">Romance</option>
            <option value="sci-fi">Sci-fi</option>
            <option value="thriller">Thriller</option>
            <option value="western">Western</option>
            <option value="animation">Animation</option>
            <option value="drama">Drama</option>
            <option value="documentary">Documentary</option>
          </select>
        </div>
      )}
      <img
        className="big_img"
        id="bigImg"
        src={
          "https://res.cloudinary.com/minh-quang-21-kg/image/upload/v1635843565/movie/481123_uqa9vw.jpg"
        }
        alt=""
      />
      <img
        className="titleImg"
        src="https://res.cloudinary.com/minh-quang-21-kg/image/upload/v1635952463/movie/the-avengers-logo-11549475716qx36aspyq6-removebg-preview_jeta7n.png"
      />
      <div className="poster_card">
        <img
          className="small_img"
          src={
            "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg"
          }
          alt=""
        />
      </div>
      <div className="info">
        <span className="desc">
          Earth's Mightiest Heroes stand as the planet's first line of defense
          against the most powerful threats in the universe. The Avengers began
          as a group of extraordinary individuals who were assembled to defeat
          Loki and his Chitauri army in New York City.
        </span>
        <div className="buttons">
          <Button className="play">
            <PlayArrow color="primary" />
            Watch now !
          </Button>
          <OutlineButton>
            <InfoOutlined />
            Watch trailer
          </OutlineButton>
        </div>
      </div>
    </div>
  );
}
