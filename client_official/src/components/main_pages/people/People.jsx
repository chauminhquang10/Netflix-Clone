import React, { useState, useEffect } from "react";
import "./style.scss";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const Person = {
  name: "",
  image: "",
  gender: "",
  place_of_birth: "",
  birthday: "",
  biography: "",
  tmdbID: "",
  knownFor: [],
};
const People = () => {
  const params = useParams();
  const [actor, setActor] = useState(Person);

  useEffect(() => {
    const getDetailActor = async () => {
      if (params.id) {
        try {
          if (params.id[0] === "@") {
            const res = await axios.get(
              `/api/directors/${params.id.replace("@", "")}`
            );
            if (res !== null) {
              setActor(res.data.director);
              console.log();
            }
          } else {
            const res = await axios.get(`/api/actors/${params.id}`);
            if (res !== null) {
              setActor(res.data.actor);
            }
          }
        } catch (error) {
          alert(error.response.data.msg);
        }
      }
    };
    getDetailActor();
  }, [params.id]);

  return (
    <>
      <section className="section-people-page">
        <div className="people-page-container">
          <div className="left-column-container">
            <div className="left-column-img">
              {actor.image === "https://image.tmdb.org/t/p/original/null" ? (
                <img
                  alt=""
                  src={
                    "https://res.cloudinary.com/minh-quang-21-kg/image/upload/v1655541960/movie/unknown_p0ax5n.jpg"
                  }
                />
              ) : (
                <img alt="" src={actor.image}></img>
              )}
            </div>
            <div className="left-column-media">
              <div className="media-item">FB</div>
              <div className="media-item">TW</div>
              <div className="media-item">IS</div>
            </div>
            <div className="left-column-info">
              <div className="column-title">Personal info</div>
              <div className="info-item">
                <div className="info-title">Know For</div>
                {/* <div className="info-text">{actor.knownFor}</div> */}
              </div>
              <div className="info-item">
                <div className="info-title">Gender</div>
                <div className="info-text">{actor.gender}</div>
              </div>
              <div className="info-item">
                <div className="info-title">Birthday</div>
                <div className="info-text">{actor.birthday}</div>
              </div>
              <div className="info-item">
                <div className="info-title">Place of Birth</div>
                <div className="info-text">{actor.place_of_birth}</div>
              </div>
            </div>
          </div>
          <div className="right-column-container">
            <div className="right-column-title">{actor.name}</div>
            <div className="right-column-bio">
              <div className="bio-title">Biography</div>
              <div className="bio-content">
                {actor.biography.length > 0
                  ? actor.biography.replace(
                      "From Wikipedia, the free encyclopedia",
                      ""
                    )
                  : "There are no information about this person Biography, we will update as soon as possible :3"}
              </div>
            </div>
            <div className="know-for">
              <div className="item-container">
                {actor.knownFor.map((item) => {
                  return (
                    <Link to={`/detail/${item._id}`}>
                      <div className="know-for-item">
                        <div className="item-img">
                          <img
                            alt=""
                            src={item.imgSmall.replace("original", "w300")}
                          ></img>
                        </div>
                        <div className="item-title">{item.title}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default People;
